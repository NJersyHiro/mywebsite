import { getAllProjects } from "@/lib/projects";
import { getAllPersonalProjects } from "@/lib/personal-projects";
import ProjectCard from "@/components/projects/ProjectCard";
import PersonalProjectCard from "@/components/projects/PersonalProjectCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Hiromichi Yamamoto",
  description:
    "山本浩裕の開発実績一覧。AI・フルスタック・インフラまで幅広いプロジェクトを紹介。",
};

export default function ProjectsPage() {
  const projects = getAllProjects();
  const personalProjects = getAllPersonalProjects();

  return (
    <main className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Page header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
            Projects
          </h1>
          <p className="text-text-sub text-lg">開発実績</p>
        </div>

        {/* Work projects section */}
        <section className="mb-20">
          <h2 className="text-2xl font-semibold mb-6 text-text-main">
            業務開発実績
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </section>

        {/* Personal projects section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-text-main">
            個人開発実績
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {personalProjects.map((project) => (
              <PersonalProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
