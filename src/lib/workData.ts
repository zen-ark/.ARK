import { getCollection } from "astro:content";

export type WorkItem = {
  slug: string;
  url: string;
  title: string;
  cover: string; // image or video path
  coverAlt?: string;
  services: string[];
  client?: string;
  year?: number;
  featured?: boolean;
};

/**
 * Loads projects from the MDX collection and maps them to WorkItem.
 * Sorts featured first, then year desc. Limit defaults to 6.
 */
export async function loadWork(limit = 6): Promise<WorkItem[]> {
  const all = await getCollection("projects");
  const items: WorkItem[] = all.map((p) => ({
    slug: p.slug,
    url: `/projects/${p.slug}`,
    title: p.data.title,
    cover: p.data.cover,
    coverAlt: p.data.coverAlt ?? `Cover image of ${p.data.title}`,
    services: p.data.services ?? [],
    client: (p.data as any).client,
    year: p.data.year,
    featured: p.data.featured ?? false,
  }));

  items.sort((a, b) => {
    if ((b.featured ? 1 : 0) !== (a.featured ? 1 : 0)) return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    const ay = a.year ?? 0;
    const by = b.year ?? 0;
    return by - ay;
  });

  return items.slice(0, limit);
}


