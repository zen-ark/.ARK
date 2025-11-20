import ProjectCard from "./ProjectCard";

export type FeaturedProjectsProps = {
  items: Array<{
    slug: string;
    url: string;
    title: string;
    tags: string[];
    cover: string;
    coverAlt?: string;
    accent?: string;
  }>;
  title?: string;
  subtitle?: string;
};

export default function FeaturedProjects({ items, title = "Featured Projects", subtitle = "A selection of recent work." }: FeaturedProjectsProps) {
  return (
    <section aria-labelledby="featured-projects-title" className="max-w-6xl mx-auto px-6 py-12">
      <header className="mb-8">
        <h2 id="featured-projects-title" className="text-2xl md:text-3xl font-semibold">
          {title}
        </h2>
        {subtitle && <p className="text-white/70 mt-2">{subtitle}</p>}
      </header>
      <div
        className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8"
        role="list"
      >
        {items.map((p) => (
          <div key={p.slug} role="listitem" className="md:col-span-6">
            <ProjectCard url={p.url} title={p.title} tags={p.tags} cover={p.cover} coverAlt={p.coverAlt} accent={p.accent} />
          </div>
        ))}
      </div>
    </section>
  );
}


