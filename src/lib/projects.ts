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
  showInAgency?: boolean;
  showInPortfolio?: boolean;
  orderAgency?: number;
  orderHiring?: number;
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
  featured?: boolean;
  orderHiring?: number;
  workInProgress?: boolean;
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

export type LoadProjectsOptions = {
  mode?: 'agency' | 'portfolio' | 'hiring'; // 'hiring' is alias for 'portfolio'
  limit?: number;
};

export async function loadProjects({ mode = 'agency', limit }: LoadProjectsOptions = {}): Promise<ProjectListItem[]> {
  const all = await getCollection("projects");
  
  const filtered = all.filter((p) => {
    // If explicit flags are set, respect them
    if (mode === 'portfolio' || mode === 'hiring') {
      return p.data.showInPortfolio === true;
    }
    // Default to agency mode
    return p.data.showInAgency !== false;
  });

  const mapped: ProjectListItem[] = filtered.map((p) => ({
    slug: p.slug,
    url: (mode === 'portfolio' || mode === 'hiring') ? `/portfolio/projects/${p.slug}` : `/projects/${p.slug}`,
    title: p.data.title,
    tags: p.data.tags ?? [],
    summary: p.data.summary,
    cover: p.data.cover,
    coverAlt: p.data.coverAlt ?? p.data.title,
    accent: (p.data as any).accent,
    status: p.data.status,
    year: p.data.year,
    orderHiring: p.data.orderHiring,
    workInProgress: p.data.workInProgress,
    // carry through featured for sorting (not in type on purpose)
    ...(p.data.featured ? { featured: true } : {}),
  }));

  let sorted = mapped;

  if (mode === 'portfolio' || mode === 'hiring') {
    sorted = mapped.sort((a, b) => {
      // Sort by orderHiring if available (ascending: 1, 2, 3...)
      if (a.orderHiring !== undefined && b.orderHiring !== undefined) {
        return a.orderHiring - b.orderHiring;
      }
      // If one has order and other doesn't, put the one with order first
      if (a.orderHiring !== undefined) return -1;
      if (b.orderHiring !== undefined) return 1;
      
      // Fallback to default sort
      return sortProjects(a, b);
    });
  } else {
    sorted = mapped.sort(sortProjects);
  }
  
  if (limit) {
    return sorted.slice(0, limit);
  }
  
  return sorted;
}

// Keep this for backward compatibility if needed, or deprecate
export async function loadFeaturedProjects(limit = 6): Promise<ProjectListItem[]> {
  return loadProjects({ mode: 'agency', limit });
}
