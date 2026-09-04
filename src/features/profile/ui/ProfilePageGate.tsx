import { notFound } from "next/navigation";

import { ProfilePageView } from "#/features/profile/ui/ProfilePageView";

type ProfilePageGateProps = {
  params: Promise<{ userId: string }>;
};

/** Server gate: validate `userId` before rendering client profile view (inside Suspense). */
export async function ProfilePageGate({ params }: ProfilePageGateProps) {
  const { userId } = await params;
  if (!userId.trim()) {
    notFound();
  }

  return <ProfilePageView />;
}
