import { defineCollection, z } from "astro:content";

const projects = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      date: z.string(),
      year: z.union([z.number(), z.string()]).optional(),
      client: z.string().optional(),
      summary: z.string(),
      summaryCard: z.string().optional(),
      outcomeLine: z.string().optional(),
      role: z.string().optional(),
      context: z.string().optional(),
      stack: z.array(z.string()).default([]),
      category: z.enum(["selected", "explorations", "wip"]).optional(),
      services: z.array(z.string()).default([]),
      tags: z.array(z.string()).default([]),
      // Require explicit cover asset path for controlled art direction
      cover: z.string().min(1, { message: "Project cover is required" }),
      // Optional descriptive alt text for the cover image
      coverAlt: z.string().optional(),
      hero: image().optional(),
      gallery: z.array(image()).default([]),
      roles: z.array(z.string()).default([]),
      tech: z.array(z.string()).default([]),
      links: z
        .object({
          demo: z.string().url().optional(),
          live: z.string().url().optional(),
          repo: z.string().url().optional(),
        })
        .partial()
        .optional(),
      status: z.enum(["live", "beta", "archived"]).default("live"),
      featured: z.boolean().default(false),
      featuredAgency: z.boolean().default(false),
      featuredHiring: z.boolean().default(false),
      showInAgency: z.boolean().default(true),
      showInPortfolio: z.boolean().default(false),
      orderAgency: z.number().optional(),
      orderHiring: z.number().optional(),
      workInProgress: z.boolean().default(false),
      isCaseStudy: z.boolean().default(false),
    }),
});

const posts = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.string(),
      tags: z.array(z.string()).default([]),
      excerpt: z.string(),
      coverImage: image().optional(),
      author: z.string().default(".ARK"),
      published: z.boolean().default(true),
    }),
});

export const collections = { projects, posts };

