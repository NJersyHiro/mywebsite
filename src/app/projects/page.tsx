import { getAllProjects } from "@/lib/projects";
import ProjectCard from "@/components/projects/ProjectCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | HY Portfolio",
  description: "山本浩裕の開発実績一覧。AI・フルスタック・インフラまで幅広いプロジェクトを紹介。",
};

export default function ProjectsPage() {
  const projects = getAllProjects();

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

        {/* Project grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </main>
  );
}
