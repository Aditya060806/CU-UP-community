import { ResourcesContent } from "@/components/resources-content";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata = generatePageMetadata({
  title: "Student Resources Hub",
  description:
    "A curated collection of the best free learning resources, tools, and platforms for CU-UP students — covering Web Dev, AI/ML, DevOps, Cybersecurity, and Competitive Programming.",
  path: "/resources",
});

export default function ResourcesPage() {
  return <ResourcesContent />;
}
