import Link from "next/link";
import { getAllProjects } from "@/lib/projects";
import ProjectCard from "@/components/projects/ProjectCard";

export default function ProjectsPreview() {
  const projects = getAllProjects().slice(0, 3);

  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-2">
          <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
            Projects
          </span>
        </h2>
        <p className="text-text-sub text-lg">開発実績</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>

      <div className="text-center">
        <Link
          href="/projects"
          className="inline-block px-6 py-3 rounded-lg border border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10 transition-colors duration-300"
        >
          すべてのプロジェクトを見る &rarr;
        </Link>
      </div>
    </section>
  );
}
