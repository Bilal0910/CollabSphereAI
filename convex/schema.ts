import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables, // This will include the default tables for user authentication (e.g., "users", "sessions", etc.)

  // Your other tables...

  subscriptions: defineTable({
    userId: v.id("users"), // Reference to the user who owns this subscription
    polarCustomerId: v.string(), // The customer ID from Polar
    polarSubscriptionId: v.string(), // The subscription ID from Polar
    productId: v.optional(v.string()), // The product ID from Polar, if applicable
    priceId: v.optional(v.string()), // The price ID from Polar, if applicable
    planCode: v.optional(v.string()), // The plan code from Polar, if applicable
    status: v.string(), // e.g., "active", "canceled", "past_due", etc.
    currentPeriodEnd: v.optional(v.number()), // Timestamp for when the current subscription period ends
    trialEndsAt: v.optional(v.number()), // Timestamp for when the trial period ends, if applicable
    cancelAt: v.optional(v.number()), // Timestamp for when the subscription is set to cancel, if applicable
    canceldAt: v.optional(v.number()), // Timestamp for when the subscription was canceled, if applicable
    seats: v.optional(v.number()), // Number of seats for the subscription, if applicable
    metadata: v.optional(v.any()), // Any additional metadata you want to store about the subscription
    creditsBalance: v.number(), // The current credits balance for the user, can be updated based on subscription changes
    creditsGrantPerPeriod: v.number(), // The number of credits granted per subscription period, if applicable
    creditsRolloverLimit: v.number(), // The maximum number of credits that can be rolled over to the next period, if applicable
    lastGrantCursor: v.optional(v.string()), // A cursor to track the last time credits were granted, can be used for incremental updates
  })
    .index("by_userId", ["userId"]) // Index by userId for easy retrieval of all credit changes for a user
    .index("by_polarSubscriptionId", ["polarSubscriptionId"]) // Index by polarSubscriptionId for easy retrieval of subscription details based on Polar subscription ID
    .index("by_status", ["status"]), // Index by status for easy retrieval of active subscriptions, etc.

  credits_ledger: defineTable({
    userId: v.id("users"),
    subscriptionId: v.id("subscriptions"), // Reference to the subscription associated with this credit change, if applicable
    amount: v.number(), // Positive for credits added, negative for credits deducted
    type: v.string(), // e.g., "credit" or "debit"
    reason: v.optional(v.string()), // e.g., "project creation", "subscription payment", etc.
    idempotencyKey: v.optional(v.string()), // To prevent duplicate entries
    meta: v.optional(v.any()), // Any additional metadata you want to store
  })
    .index("by_userId", ["userId"])
    .index("by_subscriptionId", ["subscriptionId"]) // Index by subscriptionId
    .index("by_idempotencyKey", ["idempotencyKey"]), // Index by idempotencyKey to prevent duplicates

  projects: defineTable({
    name: v.string(), // The name of the project
    userId: v.id("users"),
    title: v.optional(v.string()), // The title of the project
    description: v.optional(v.string()), // A brief description of the project
    styleGuide: v.optional(v.string()), // e.g., "minimalist", "vintage", "modern", etc.
    sketchesData: v.any(), // Raw data for the sketchs, can be a JSON object or any other format you choose
    canvasData: v.optional(v.any()), // Raw data for the canvas, can be a JSON object or any other format you choose
    viewportData: v.optional(v.any()), // Raw data for the viewport, can be a JSON object or any other format you choose
    generatedDesignData: v.optional(v.any()), // Raw data for the generated design, can be a JSON object or any other format you choose
    thumbnail: v.optional(v.string()), // URL or base64 string for the project thumbnail
    moodBoardImages: v.optional(v.array(v.string())), // URLs or base64 strings for the mood board images
    inspirationImages: v.optional(v.array(v.string())), // URLs or base64 strings for the inspiration images
    lastModified: v.number(), // Timestamp for when the project was last modified
    createdAt: v.number(), // Timestamp for when the project was created
    isPublic: v.optional(v.boolean()), // Whether the project is public or private
    tags: v.optional(v.array(v.string())), // Tags for categorizing the project
    projectNumber: v.number(), // A sequential number for the project, unique per user
  })
    .index("by_userId", ["userId"])
    .index("by_userId_lastModified", ["userId", "lastModified"]),

  project_counters: defineTable({
    userId: v.id("users"),
    nextProjectNumber: v.number(), // The next project number to be assigned for this user
  }).index("by_userId", ["userId"]),
});

export default schema;
