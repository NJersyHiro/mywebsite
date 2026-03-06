import Link from "next/link";
import { getAllPersonalProjects } from "@/lib/personal-projects";
import PersonalProjectCard from "@/components/projects/PersonalProjectCard";

export default function PersonalProjectsPreview() {
  const projects = getAllPersonalProjects().slice(0, 3);

  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-2">
          <span className="bg-gradient-to-r from-neon-purple to-neon-blue bg-clip-text text-transparent">
            Personal Projects
          </span>
        </h2>
        <p className="text-text-sub text-lg">個人開発実績</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {projects.map((project) => (
          <PersonalProjectCard key={project.slug} project={project} />
        ))}
      </div>

      <div className="text-center">
        <Link
          href="/personal-projects"
          className="inline-block px-6 py-3 rounded-lg border border-neon-purple/30 text-neon-purple hover:bg-neon-purple/10 transition-colors duration-300"
        >
          すべての個人プロジェクトを見る &rarr;
        </Link>
      </div>
    </section>
  );
}
