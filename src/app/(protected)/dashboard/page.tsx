import { SubscriptionEntitlementQuery } from '@/convex/query.config';
import { combinedSlug } from '@/lib/utils';
import { redirect } from 'next/navigation';


const Page = async () => {

    const { entitlement, profileName } = await SubscriptionEntitlementQuery();

    // If user has NO entitlement → billing
  if (!entitlement._valueJSON) {
    redirect(`/billing/${combinedSlug(profileName!)}`);
  }

  // If user has entitlement → dashboard/username
  redirect(`/dashboard/${combinedSlug(profileName!)}`);
};


export default Page