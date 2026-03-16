import Link from "next/link";
import { CommunityGuideline } from "@/components/community-guideline"; // Corrected import path
import { PageHeader } from "@/components/page-header";
import { RoleDescription } from "@/components/role-description";
import { TeamStructure } from "@/components/team-structure";
import { Button } from "@/components/ui/button";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata = generatePageMetadata({
  title: "Community Structure",
  description:
    "Discover the SDLA model that drives CU-UP's growth and success. Learn about the roles of Students, Developers, Leads, and Alumni Mentors in our community structure.",
  path: "/structure",
});

export default function CommunityStructurePage() {
  return (
    <div className="container mx-auto px-6 py-12 max-w-7xl">
      <PageHeader
        title="Community Structure"
        description="Discover the SDLA model that drives CU-UP's growth and success."
      />

      <div className="mt-4">
        <TeamStructure />
      </div>

      <div className="mt-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight">
            Role Descriptions
          </h2>
          <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
            Each role in our community represents a step in your journey, from
            learning the basics to becoming a leader.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/** biome-ignore lint/a11y/useValidAriaRole: it's a visual card */}
          <RoleDescription
            role="S - Student"
            years="1st & 2nd year students"
            description="Curious learners who form the foundation of CU-UP, participating in workshops, hackathons, and beginner-friendly projects to build core skills."
            responsibilities={[
              "Attend community workshops and events",
              "Learn fundamental technologies and concepts",
              "Contribute to team projects under guidance",
              "Participate in hackathons and coding contests",
            ]}
          />

          {/** biome-ignore lint/a11y/useValidAriaRole: it's a visual card */}
          <RoleDescription
            role="D - Developer"
            years="2nd & 3rd year students"
            description="Proven contributors who lead projects, conduct knowledge-sharing sessions, and actively mentor Students while pushing the boundaries of their tech stack."
            responsibilities={[
              "Lead and ship community projects",
              "Conduct tech talks and workshops",
              "Mentor and support Students",
              "Contribute to open-source repositories",
            ]}
          />

          {/** biome-ignore lint/a11y/useValidAriaRole: it's a visual card */}
          <RoleDescription
            role="L - Lead"
            years="4th year students"
            description="Senior members who set the technical direction, manage cross-team projects, and represent CU-UP at external events."
            responsibilities={[
              "Set technical direction for the community",
              "Manage club governance and partnerships",
              "Supervise Developers and Students",
              "Represent CU-UP at external events",
            ]}
          />

          {/** biome-ignore lint/a11y/useValidAriaRole: it's a visual card */}
          <RoleDescription
            role="A - Alumni Mentor"
            years="Alumni & Professionals"
            description="Graduated members who give back by sharing industry experience, providing career guidance, and ensuring the community keeps evolving."
            responsibilities={[
              "Mentor current students on career paths",
              "Provide industry insights and connections",
              "Support the community through funds or resources",
              "Conduct masterclasses and guest sessions",
            ]}
          />
        </div>
      </div>

      <div className="mt-24">
        <CommunityGuideline />
      </div>

      <div className="mt-24 text-center">
        <h2 className="text-4xl font-bold tracking-tight mb-4">
          Join Our Thriving Community
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Whether you&apos;re just starting or looking to lead, there&apos;s a
          place for you here. Grow your skills, build your network, and make an
          impact.
        </p>
        <Link href="/join">
          <Button size="lg">Become a Member</Button>
        </Link>
      </div>
    </div>
  );
}
