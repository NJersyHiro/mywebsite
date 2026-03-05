import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllProjects, getProjectWithHtml } from "@/lib/projects";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  const projects = getAllProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectWithHtml(slug);
  if (!project) {
    return { title: "Project Not Found" };
  }
  return {
    title: `${project.title} | HY Portfolio`,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectWithHtml(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Back link */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-1 text-text-sub hover:text-neon-blue transition-colors duration-300 mb-8"
        >
          <span aria-hidden="true">&larr;</span> Projects
        </Link>

        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
            {project.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-sm text-text-sub mb-6">
            <span>{project.period}</span>
            <span className="w-1 h-1 rounded-full bg-text-sub" />
            <span>{project.role}</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs rounded-full px-3 py-1 bg-neon-purple/10 text-neon-purple border border-neon-purple/20"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* Content */}
        <article
          className="prose prose-invert max-w-none prose-headings:text-text-main prose-p:text-text-sub prose-li:text-text-sub prose-strong:text-neon-blue prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-2"
          dangerouslySetInnerHTML={{ __html: project.html }}
        />
      </div>
    </main>
  );
}
