import Link from "next/link";
import type { Project } from "@/lib/projects";

interface ProjectCardProps {
  readonly project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const visibleTags = project.tags.slice(0, 4);

  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <article className="bg-card-bg rounded-xl border border-white/5 overflow-hidden transition-all duration-300 group-hover:border-neon-blue/30 group-hover:-translate-y-2 group-hover:shadow-[0_0_30px_rgba(0,212,255,0.1)]">
        {/* Gradient thumbnail placeholder */}
        <div className="aspect-video bg-gradient-to-br from-neon-blue/10 to-neon-purple/10 flex items-center justify-center">
          <span className="text-4xl text-text-sub/30 font-bold select-none">
            {project.title.charAt(0)}
          </span>
        </div>

        {/* Card body */}
        <div className="p-5">
          <h3 className="text-lg font-semibold text-text-main mb-2 group-hover:text-neon-blue transition-colors duration-300">
            {project.title}
          </h3>

          <p className="text-sm text-text-sub line-clamp-2 mb-4 leading-relaxed">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {visibleTags.map((tag) => (
              <span
                key={tag}
                className="text-xs rounded-full px-3 py-1 bg-neon-purple/10 text-neon-purple border border-neon-purple/20"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </article>
    </Link>
  );
}
