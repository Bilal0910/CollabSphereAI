// This file is for defining subscription-related queries that can be used in the frontend to fetch data from the backend.
// ------------------------------------------------------------------------------------------------------------

import { v } from "convex/values";
import { query } from "./_generated/server";

// Example of a query to check if a user has an active subscription entitlement
export const hasEntitlement = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const now = Date.now();
    for await (const sub of ctx.db
      .query("subscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", userId))) {
      const status = String(sub.status || "").toLowerCase();
      const periodOk =
        sub.currentPeriodEnd == null || sub.currentPeriodEnd > now;
      if (status === "active" && periodOk) return true;
    }
  },
});
