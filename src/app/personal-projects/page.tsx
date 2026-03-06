import { getAllPersonalProjects } from "@/lib/personal-projects";
import PersonalProjectCard from "@/components/projects/PersonalProjectCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Personal Projects | HY Portfolio",
  description:
    "山本浩裕の個人開発プロジェクト一覧。AI・自動化・フルスタックの個人開発実績を紹介。",
};

export default function PersonalProjectsPage() {
  const projects = getAllPersonalProjects();

  return (
    <main className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Page header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-neon-purple to-neon-blue bg-clip-text text-transparent">
            Personal Projects
          </h1>
          <p className="text-text-sub text-lg">個人開発実績</p>
        </div>

        {/* Project grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <PersonalProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </main>
  );
}
