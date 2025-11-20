import { getCollection } from "astro:content";

export type ProjectFrontmatter = {
  title: string;
  date?: string;
  year?: number;
  status?: "live" | "beta" | "archived";
  tags?: string[];
  summary?: string;
  cover: string;
  coverAlt?: string;
  accent?: string;
  featured?: boolean;
};

export type ProjectListItem = {
  slug: string;
  url: string;
  title: string;
  tags: string[];
  summary?: string;
  cover: string;
  coverAlt?: string;
  accent?: string;
  status?: string;
  year?: number;
};

function sortProjects(a: ProjectListItem, b: ProjectListItem): number {
  const yearA = a.year ?? 0;
  const yearB = b.year ?? 0;
  if (yearA !== yearB) return yearB - yearA;
  const featuredA = (a as any).featured ? 1 : 0;
  const featuredB = (b as any).featured ? 1 : 0;
  if (featuredA !== featuredB) return featuredB - featuredA;
  return 0;
}

export async function loadFeaturedProjects(limit = 6): Promise<ProjectListItem[]> {
  const all = await getCollection("projects");
  const mapped: ProjectListItem[] = all.map((p) => ({
    slug: p.slug,
    url: `/projects/${p.slug}`,
    title: p.data.title,
    tags: p.data.tags ?? [],
    summary: p.data.summary,
    cover: p.data.cover,
    coverAlt: p.data.coverAlt ?? p.data.title,
    accent: (p.data as any).accent,
    status: p.data.status,
    year: p.data.year,
    // carry through featured for sorting (not in type on purpose)
    ...(p.data.featured ? { featured: true } : {}),
  }));

  return mapped.sort(sortProjects).slice(0, limit);
}


