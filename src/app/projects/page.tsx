import { BackgroundPattern } from "@/components/background-pattern";
import { PageHeader } from "@/components/page-header";
import { ProjectList } from "@/components/project-list";
import { getPortalProjects } from "@/lib/db";
import { generatePageMetadata } from "@/lib/metadata";
import type { Project } from "@/types/project";

export const dynamic = "force-dynamic";

export const metadata = generatePageMetadata({
  title: "Projects",
  description:
    "Explore the collaborative projects built by the CU-UP community. Discover open-source initiatives, student projects, and innovative solutions created by our tech enthusiasts.",
  path: "/projects",
});

export default async function ProjectsPage() {
  // Fetch from the live database
  const allProjects = await getPortalProjects();
  const portalProjects = allProjects.filter(p => p.status === "approved" || p.status === "featured");

  // Map to the legacy Project interface expected by the UI components
  // Featured projects go first
  const mappedProjects: Project[] = portalProjects
    .sort((a, b) => {
      if (a.status === "featured" && b.status !== "featured") return -1;
      if (b.status === "featured" && a.status !== "featured") return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .map(p => ({
      id: p.id,
      title: p.name,
      description: p.description,
      image: "", // Empty so it falls back or uses placeholder
      github: p.githubUrl,
      link: p.liveUrl,
      tags: [p.language, ...(p.topics || [])].filter(Boolean) as string[],
      categories: p.categories && p.categories.length > 0 ? p.categories : ["Other"],
      contributors: [{
        kind: "student",
        name: p.submittedByName,
        role: "Creator",
        college: "Chandigarh University"
      }]
    }));

  return (
    <BackgroundPattern variant="default">
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <PageHeader
          title="Projects"
          description="Explore the collaborative projects built by the CU-UP community"
        />

        <ProjectList initialProjects={mappedProjects} />
      </div>
    </BackgroundPattern>
  );
}
