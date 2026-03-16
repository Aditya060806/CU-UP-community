import { CommunityCard } from "@/components/community-card";
import { PageHeader } from "@/components/page-header";
import { getClubs } from "@/lib/db";
import { generatePageMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export const metadata = generatePageMetadata({
  title: "Tech Clubs & Societies",
  description:
    "Discover the tech clubs and societies at Chandigarh University, Uttar Pradesh. Explore CU-UP's coding club, AI/ML society, cybersecurity club, web dev society, robotics club, and open source society.",
  path: "/communities",
});

export default async function ClubsPage() {
  const communities = await getClubs();

  return (
    <div className="container mx-auto px-6 py-12 max-w-7xl">
      <PageHeader
        title="Tech Clubs & Societies"
        description="Explore the active tech communities that make up CU-UP"
      />

      <div className="grid md:grid-cols-2 gap-12 mt-12">
        {communities.map((community) => (
          <CommunityCard key={community.id} community={community as any} />
        ))}
        {communities.length === 0 && (
          <div className="col-span-2 text-center text-zinc-500 py-12">
            No clubs found. Staff can add clubs from the portal.
          </div>
        )}
      </div>
    </div>
  );
}
