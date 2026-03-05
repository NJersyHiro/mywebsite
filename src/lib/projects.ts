import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

export interface Project {
  slug: string;
  title: string;
  description: string;
  role: string;
  period: string;
  tags: string[];
  thumbnail: string;
  order: number;
  content: string;
}

const projectsDir = path.join(process.cwd(), "content/projects");

export function getAllProjects(): Project[] {
  const files = fs.readdirSync(projectsDir).filter((f) => f.endsWith(".mdx"));
  const projects = files.map((file) => {
    const slug = file.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(projectsDir, file), "utf-8");
    const { data, content } = matter(raw);
    return {
      slug,
      title: data.title ?? "",
      description: data.description ?? "",
      role: data.role ?? "",
      period: data.period ?? "",
      tags: data.tags ?? [],
      thumbnail: data.thumbnail ?? "/images/projects/default.png",
      order: data.order ?? 99,
      content,
    };
  });
  return projects.sort((a, b) => a.order - b.order);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getAllProjects().find((p) => p.slug === slug);
}

export async function getProjectWithHtml(
  slug: string
): Promise<(Project & { html: string }) | undefined> {
  const project = getProjectBySlug(slug);
  if (!project) return undefined;
  const processed = await remark().use(html).process(project.content);
  return { ...project, html: processed.toString() };
}
