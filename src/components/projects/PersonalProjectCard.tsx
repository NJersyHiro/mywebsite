import Link from "next/link";
import type { PersonalProject } from "@/lib/personal-projects";

interface PersonalProjectCardProps {
  readonly project: PersonalProject;
}

export default function PersonalProjectCard({
  project,
}: PersonalProjectCardProps) {
  const visibleTags = project.tags.slice(0, 4);

  return (
    <Link href={`/personal-projects/${project.slug}`} className="group block">
      <article className="bg-card-bg rounded-xl border border-white/5 overflow-hidden transition-all duration-300 group-hover:border-neon-purple/30 group-hover:-translate-y-2 group-hover:shadow-[0_0_30px_rgba(123,47,247,0.1)]">
        {/* Gradient thumbnail placeholder */}
        <div className="aspect-video bg-gradient-to-br from-neon-purple/10 to-neon-blue/10 flex items-center justify-center relative">
          <span className="text-4xl text-text-sub/30 font-bold select-none">
            {project.title.charAt(0)}
          </span>
          {/* GitHub badge */}
          <span className="absolute top-3 right-3 flex items-center gap-1.5 text-xs text-text-sub bg-background/80 rounded-full px-3 py-1 border border-white/10">
            <svg
              className="w-3.5 h-3.5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
            GitHub
          </span>
        </div>

        {/* Card body */}
        <div className="p-5">
          <h3 className="text-lg font-semibold text-text-main mb-2 group-hover:text-neon-purple transition-colors duration-300">
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
                className="text-xs rounded-full px-3 py-1 bg-neon-blue/10 text-neon-blue border border-neon-blue/20"
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
