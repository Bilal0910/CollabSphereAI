// This file defines the Convex query for fetching the current user's profile information from the database.
// --------------------------------------------------------------------------------------------

import { getAuthUserId } from '@convex-dev/auth/server'
import { query } from './_generated/server'

// The getCurrentUser query retrieves the current user's profile from the Convex database using their authentication ID.
export const getCurrentUser = query({
    args: {},
    handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return null
    return await ctx.db.get(userId)
    }
})