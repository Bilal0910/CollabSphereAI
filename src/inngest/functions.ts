import { fetchMutation, fetchQuery } from "convex/nextjs";
import { inngest } from "./client";
import { api } from "../../convex/_generated/api";
import {
  extractOrderLike,
  extractSubscriptionLike,
  isEntitledStatus,
  isPolarWebhookEvent,
  PolarOrder,
  PolarSubscription,
  RecievedEvent,
  toMs,
} from "@/types/polar";
import { Id } from "../../convex/_generated/dataModel";

export const autosaveProjectWorkflow = inngest.createFunction(
  {
    id: "autosave-project-workflow",
  },
  { event: "project/autosave.requested" },
  async ({ event }) => {
    const { projectId, shapesData, viewportData } = event.data;
    try {
      await fetchMutation(api.projects.updateProjectSkethces, {
        projectId,
        sketchesData: shapesData,
        viewportData,
      });
    } catch (error) {
      throw error;
    }
  },
);

const grantKey = (
  subId: string,
  periodEndMs?: number,
  eventId?: string | number,
): string =>
  periodEndMs != null
    ? `${subId}-${periodEndMs}`
    : eventId != null
      ? `${subId}:evt:${eventId}`
      : `${subId}:first`;

export const handlePolarEvent = inngest.createFunction(
  { id: "polar-webhook-handler" },
  { event: "polar/webhook.received" },
  async ({ event, step }) => {
    console.log("Starting Polar Web hook handler");
    console.log("Inngest Raw event data:", JSON.stringify(event.data, null, 2));

    if (!isPolarWebhookEvent(event.data)) {
      return;
    }

    const incoming = event.data as RecievedEvent;
    const type = incoming.type;
    const dataUnknown = incoming.data;

    const sub: PolarSubscription | null = extractSubscriptionLike(dataUnknown);
    const order: PolarOrder | null = extractOrderLike(dataUnknown);

    if (!sub && !order) {
      return;
    }

    const userId: Id<"users"> | null = await step.run(
      "resolve-user",
      async () => {
        const metaUserId =
          (sub?.metadata?.userId as string | undefined) ??
          (order?.metadata?.userId as string | undefined);

        if (metaUserId) {
          console.log("Found user ID in metadata:", metaUserId);
          return metaUserId as unknown as Id<"users">;
        }

        const email = sub?.customer?.email ?? order?.customer?.email ?? null;
        console.log("Found user email:", email);
        if (email) {
          try {
            console.log("Trying to find user by email", email);
            const foundUserId = await fetchQuery(api.user.getUserIdByEmail, {
              email,
            });

            console.log("Found user ID by email:", foundUserId);
            return foundUserId;
          } catch (error) {
            console.error("Failed to find user by email", error);
            console.error("Error finding user by email:", email);
            return null;
          }
        }

        console.log("No user ID found in metadata or email");
        return null;
      },
    );

    console.log("Found user ID:", userId);
    if (!userId) {
      console.log("No user ID found, skipping webhook handler");
      return;
    }

    const polarSubscriptionId = sub?.id ?? order?.subscription_id ?? "";
    console.log("Found subscription ID:", polarSubscriptionId);
    if (!polarSubscriptionId) {
      console.log("No subscription ID found, skipping webhook handler");
      return;
    }

    const currentPeriodEnd = toMs(sub?.current_period_end);

    const payload = {
      userId,
      polarCustomerId:
        sub?.customer_id ?? sub?.customer_id ?? order?.customer_id ?? "",
      polarSubscriptionId,
      productId: sub?.product_id ?? sub?.product_id ?? undefined,
      priceId: sub?.prices?.[0]?.id ?? undefined,
      planCode: sub?.plan_code ?? sub?.product?.name ?? undefined,
      status: sub?.status ?? "updated",
      currentPeriodEnd,
      trialEndsAt: toMs(sub?.trial_ends_at),
      cancelAt: toMs(sub?.cancel_at),
      canceledAt: toMs(sub?.canceled_at),
      seats: sub?.seats ?? undefined,
      metadata: dataUnknown,
      creditsGrantPerPeriod: 10,
      creditsRolloverLimit: 100,
    };
    console.log(
      'Payload for "polar/webhook.received" event:',
      JSON.stringify(payload, null, 2),
    );

    const subscriptionId = await step.run("upsert-subscription", async () => {
      try {
        console.log("Trying to upsert subscription");
        console.log("Checking for existing subscription first...");

        const existingByPolar = await fetchQuery(
          api.subscription.getByPolarId,
          {
            polarSubscriptionId: payload.polarSubscriptionId,
          },
        );

        console.log(
          "Existing subscription:",
          existingByPolar
            ? "Found existing subscription"
            : "No existing subscription found",
        );

        const existingByUser = await fetchQuery(
          api.subscription.getSubscriptionForUser,
          {
            userId: payload.userId,
          },
        );

        console.log(
          "Existing subscription:",
          existingByUser
            ? "Found existing subscription"
            : "No existing subscription found",
        );
        if (
          existingByPolar &&
          existingByUser &&
          existingByPolar._id !== existingByUser._id
        ) {
          console.warn(
            `Found existing subscription for user ${existingByUser._id} and polar ID ${existingByPolar._id}, but they don't match.`,
          );

          console.warn(" - By Polar ID", existingByPolar._id);
          console.warn(" - By User ID", existingByUser._id);
        }

        const result = await fetchMutation(
          api.subscription.upsertFromPolar,
          payload,
        );

        const allUserSubs = await fetchQuery(api.subscription.getAllForUser, {
          userId: payload.userId,
        });

        if (allUserSubs && allUserSubs.length > 1) {
          allUserSubs.forEach((sub, index) => {
            console.error(
              `${index + 1}. ID: ${sub._id}, Polar ID: ${sub.polarSubscriptionId}, Status ${sub.status}`,
            );
          });
        }

        return result;
      } catch (error) {
        console.error("Failed to upsert subscription", error);
        console.error(
          "Error upserting subscription:",
          JSON.stringify(payload, null, 2),
        );
        throw error;
      }
    });

    const looksCreate = /subscription\.created/i.test(type);
    const looksRenew =
      /subscription\.renew|order\\.created|invoice\.paid|order\.paid/i.test(
        type,
      );

    const entitled = isEntitledStatus(payload.status);

    console.log("Entitiled:", entitled);
    console.log("type", type);
    console.log("looks like create", looksCreate);
    console.log("Looks renew:", looksRenew);
    console.log("Looks create:", looksCreate);
    console.log("status", payload.status);

    const idk = grantKey(polarSubscriptionId, currentPeriodEnd, incoming.id);

    console.log("Grant key:", idk);

    if (entitled && (looksCreate || looksRenew || true)) {
      const grant = await step.run("grant-credits", async () => {
        try {
          console.log("Granting credits...", subscriptionId);
          const result = await fetchMutation(
            api.subscription.grantCreditsIfNeeded,
            {
              subscriptionId,
              idempotencyKey: idk,
              amount: 10,
              reason: looksCreate ? "initial-grant" : "periodic-grant",
            },
          );

          console.log("Granted credits", result);
          return result;
        } catch (error) {
          console.error("Failed to grant credits", error);
          throw error;
        }
      });

      console.log("Granted credits", grant);
      if (grant.ok && !("skipped" in grant && grant.skipped)) {
        await step.sendEvent("credits-granted", {
          name: "billing/credits.granted",
          id: `credits-granted/${polarSubscriptionId}:${currentPeriodEnd ?? "first"}`,
          data: {
            userId,
            amount: "granted" in grant ? (grant.granted ?? 10) : 10,
            balance: "granted" in grant ? grant.balance : undefined,
            periodEnd: currentPeriodEnd,
          },
        });
        console.log("Sent credits-granted event");
      } else {
        console.log("Skipped credits-granted event");
      }
    } else {
      console.log("Skipped credits-granted event conditions not met");
    }

    await step.sendEvent("sub-synced", {
      name: "billing/subscription.synced",
      id: `sub-synced:${polarSubscriptionId}:${currentPeriodEnd ?? "first"}`,
      data: {
        userId,
        polarSubscriptionId,
        status: payload.status,
        currentPeriodEnd,
      },
    });

    console.log("✅ [Inngest] Subscription synced event sent");
    if (currentPeriodEnd && currentPeriodEnd > Date.now()) {
      const runAt = new Date(
        Math.max(Date.now() + 5000, currentPeriodEnd - 3 * 24 * 60 * 60 * 1000),
      );

      await step.sleepUntil("wait-until-expiry", runAt);

      const stillEntitled = await step.run("check-entitlement", async () => {
        try {
          const result = await fetchQuery(api.subscription.hasEntitlement, {
            userId,
          });

          console.log("✅ [Inngest] Entitlement status:", result);
          return result;
        } catch (error) {
          console.error("❌ [Inngest] Failed to check entitlement:", error);
          throw error;
        }
      });

      if (stillEntitled) {
        await step.sendEvent("pre-expiry", {
          name: "billing/subscription.pre_expiry",
          data: {
            userId,
            runAt: runAt.toISOString(),
            periodEnd: currentPeriodEnd,
          },
        });
      }
    }
  },
);
