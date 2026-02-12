// This file is for defining Profile queries that can be used in the frontend to fetch data from the backend.
// ------------------------------------------------------------------------------------------------------------

// Example of a query to fetch user profile information
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { preloadQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";
import { ConvexUserRaw, normalizeProfile } from "@/types/user";
import { Id } from "../../convex/_generated/dataModel";

// Example of a query to fetch user profile information
export const ProfileQuery = async () => {
  return await preloadQuery(
    api.user.getCurrentUser,
    {},
    { token: await convexAuthNextjsToken() },
  );
};

// Example of a query to fetch subscription entitlement information
export const SubscriptionEntitlementQuery = async () => {
  const rawProfile = await ProfileQuery();

  // Normalize the user profile data
  const profile = normalizeProfile(
    rawProfile._valueJSON as unknown as ConvexUserRaw | null,
  );

  // Fetch the subscription entitlement using the profile ID
  const entitlement = await preloadQuery(
    api.subscription.hasEntitlement,
    { userId: profile?.id as Id<"users"> },
    { token: await convexAuthNextjsToken() },
  );

  // Return the entitlement and profile name for use in the frontend
  return { entitlement, profileName: profile?.name };
};

export const ProjectsQuery = async () => {
  const rawProfile = await ProfileQuery();

  // Normalize the user profile data
  const profile = normalizeProfile(
    rawProfile._valueJSON as unknown as ConvexUserRaw | null,
  );

  if (!profile) {
    return { projects: null, profile: null };
  }

  const projects = await preloadQuery(
    api.projects.getUserProjects,
    { userId: profile.id as Id<"users"> },
    { token: await convexAuthNextjsToken() },
  );

  return { projects, profile };
};

export const ProjectQuery = async (projectId: string) => {
  const rawProfile = await ProfileQuery();
  const profile = normalizeProfile(
    rawProfile._valueJSON as unknown as ConvexUserRaw | null
  )

  if (!profile?.id || !projectId) {
    return { project: null, profile: null };
  }

  const project = await preloadQuery(
    api.projects.getProject,
    { projectId: projectId as Id<"projects"> },
    { token: await convexAuthNextjsToken() },
  )

  return { project, profile };
}


export const StyleGuideQuery = async (projectId: string) => {
  const styleGuide = await preloadQuery(
    api.projects.getProjectStyleGuide,
    { projectId: projectId as Id<"projects"> },
    { token: await convexAuthNextjsToken() },
  );

  return { styleGuide };
};

export const MoodBoardImagesQuery = async (projectId: string) => {
  const images = await preloadQuery(
    api.moodboard.getMoodBoardImages,
    { projectId: projectId as Id<"projects"> },
    { token: await convexAuthNextjsToken() },
  );

  return { images };
};
