// This file defines the types related to the user and profile in the application.
// --------------------------------------------------------------------------------

import { combinedSlug } from "@/lib/utils";

// The ConvexUserRaw type represents the raw user data as it is stored in the Convex database.
export type ConvexUserRaw = {
  _creationTime: number;
  _id: string;
  name?: string;
  email: string;
  image?: string;
  emailVerificationTime?: number;
};

// The Profile type represents the normalized user profile that can be used in the frontend.
export type Profile = {
  id: string; // normalized from _id
  cearetdAtMs: number; // normalized from _creationTime
  email: string;
  emailVerifiedAtMs?: number; // normalized from emailVerificationTime
  name?: string;
  image?: string;
};

// -----------------------------------------------------------------------------------------------------------

// The getCurrentUser function is a query that fetches the current user's profile from the Convex database.
export const normalizeProfile = (raw: ConvexUserRaw | null): Profile | null => {
  if (!raw) return null;
  
  const extractNameFromEmail = (email: string): string => {
    const username = email.split("@")[0];
    return username
      .split(/[._-]/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(" ");
  };

  const name = combinedSlug(raw.name!) || extractNameFromEmail(raw.email);

  return {
    id: raw._id,
    cearetdAtMs: raw._creationTime,
    email: raw.email,
    emailVerifiedAtMs: raw.emailVerificationTime,
    image: raw.image,
    name,
  };
};
