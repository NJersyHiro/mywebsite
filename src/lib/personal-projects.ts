import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

export interface PersonalProject {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  github: string;
  order: number;
  content: string;
}

const personalProjectsDir = path.join(
  process.cwd(),
  "content/personal-projects"
);

export function getAllPersonalProjects(): PersonalProject[] {
  const files = fs
    .readdirSync(personalProjectsDir)
    .filter((f) => f.endsWith(".mdx"));
  const projects = files.map((file) => {
    const slug = file.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(personalProjectsDir, file), "utf-8");
    const { data, content } = matter(raw);
    return {
      slug,
      title: data.title ?? "",
      description: data.description ?? "",
      tags: data.tags ?? [],
      github: data.github ?? "",
      order: data.order ?? 99,
      content,
    };
  });
  return projects.sort((a, b) => a.order - b.order);
}

export function getPersonalProjectBySlug(
  slug: string
): PersonalProject | undefined {
  return getAllPersonalProjects().find((p) => p.slug === slug);
}

export async function getPersonalProjectWithHtml(
  slug: string
): Promise<(PersonalProject & { html: string }) | undefined> {
  const project = getPersonalProjectBySlug(slug);
  if (!project) return undefined;
  const processed = await remark().use(html).process(project.content);
  return { ...project, html: processed.toString() };
}
