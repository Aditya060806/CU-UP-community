import type { Metadata } from "next";
import { BackgroundPattern } from "@/components/background-pattern";
import { PageHeader } from "@/components/page-header";
import { Timeline } from "@/components/timeline";
import { Card } from "@/components/ui/card";
import { getEvents } from "@/lib/get-events";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "About CU-UP",
  description:
    "Learn about CU-UP's vision, mission, and journey to build a thriving student tech community at Chandigarh University, Uttar Pradesh. Discover our core values, long-term goals, and the story behind our community.",
  path: "/about",
});

export default async function AboutPage() {
  const allEvents = await getEvents();
  const timelineEvents = allEvents
    .filter((event) => event.organizationName === "CU-UP")
    .sort(
      (a, b) =>
        new Date(b.startDateTime).getTime() -
        new Date(a.startDateTime).getTime(),
    );

  return (
    <BackgroundPattern variant="default">
      <div className="container mx-auto px-6 py-16 md:px-12 lg:px-24">
        <PageHeader
          title="About CU-UP"
          description="Learn about our vision, mission, and journey to build a thriving student tech community at Chandigarh University, UP"
        />

        <div className="grid gap-16 mt-16">
          <section>
            <h2 className="text-3xl font-bold mb-8">Our Vision & Mission</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Vision</h3>
                <p className="text-muted-foreground">
                  To create a thriving on-campus tech ecosystem at Chandigarh
                  University, UP, where every student with an idea or a spark of
                  curiosity has access to the best peers, mentors, tools, and
                  resources to turn that idea into a reality.
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Mission</h3>
                <p className="text-muted-foreground">
                  We foster a culture of project-based learning and open-source
                  contribution at CU-UP, connecting students across departments
                  to build real-world products, collaborate on meaningful
                  projects, and grow from learners to leaders.
                </p>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-8">Long-term Goals</h2>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">
                5-Year Community Vision
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  Establish CU-UP as a nationally recognized student
                  community
                </li>
                <li>
                  Ship 200+ open-source projects with real-world impact and
                  GitHub stars
                </li>
                <li>
                  Build a network of 500+ alumni mentors actively guiding
                  current students
                </li>
                <li>
                  Create clear pathways from campus learning to industry roles
                  and startups
                </li>
                <li>
                  Develop a self-sustaining community model that empowers every
                  batch of students
                </li>
              </ul>
            </Card>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-8">
              Core Values & Principles
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  id: 1,
                  title: "Build in Public",
                  description:
                    "We believe shipping real projects and sharing the journey openly is the fastest way to learn",
                },
                {
                  id: 2,
                  title: "Collaboration Over Competition",
                  description:
                    "Cross-department teams produce better outcomes than individuals working in isolation",
                },
                {
                  id: 3,
                  title: "Open Source First",
                  description:
                    "We default to open source — every project and resource we create is shared with the community",
                },
                {
                  id: 4,
                  title: "Students Lead",
                  description:
                    "The community is run by students, for students — ownership and initiative are core values",
                },
              ].map((value) => (
                <Card key={value.id} className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </Card>
              ))}
            </div>
          </section>

          {timelineEvents.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold mb-8">Our Journey</h2>
              <Timeline timelineEvents={timelineEvents} />
            </section>
          )}
        </div>
      </div>
    </BackgroundPattern>
  );
}
