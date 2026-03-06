import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllPersonalProjects,
  getPersonalProjectWithHtml,
} from "@/lib/personal-projects";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  const projects = getAllPersonalProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPersonalProjectWithHtml(slug);
  if (!project) {
    return { title: "Project Not Found" };
  }
  return {
    title: `${project.title} | HY Portfolio`,
    description: project.description,
  };
}

export default async function PersonalProjectDetailPage({
  params,
}: PageProps) {
  const { slug } = await params;
  const project = await getPersonalProjectWithHtml(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Back link */}
        <Link
          href="/personal-projects"
          className="inline-flex items-center gap-1 text-text-sub hover:text-neon-purple transition-colors duration-300 mb-8"
        >
          <span aria-hidden="true">&larr;</span> Personal Projects
        </Link>

        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-neon-purple to-neon-blue bg-clip-text text-transparent">
            {project.title}
          </h1>

          {/* GitHub link */}
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-text-sub hover:text-neon-blue transition-colors duration-300 mb-6"
          >
            <svg
              className="w-4 h-4"
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
            ソースコードを見る
          </a>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs rounded-full px-3 py-1 bg-neon-blue/10 text-neon-blue border border-neon-blue/20"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* Content */}
        <article
          className="prose prose-invert max-w-none prose-headings:text-text-main prose-p:text-text-sub prose-li:text-text-sub prose-strong:text-neon-purple prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-2"
          dangerouslySetInnerHTML={{ __html: project.html }}
        />
      </div>
    </main>
  );
}
