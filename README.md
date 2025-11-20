# ZEN.ARK — Portfolio Website

A lean, production-ready Astro portfolio stack hosted on Vercel.

## Stack

- **Astro 4** + React 18 (islands architecture)
- **Tailwind CSS** + design tokens
- **MDX** content collections (projects & posts)
- **TypeScript** strict mode
- **Image optimization** (AVIF/WebP)
- **SEO** utilities with schema.org structured data
- **Plausible Analytics** (production only, privacy-friendly)
- **Vercel** serverless adapter with edge functions

## Development

### First-time Setup

```bash
npm install       # Install dependencies
npm run dev       # Start dev server
```

### Prerequisites

- Node.js 18+ or 20+
- npm (or pnpm/yarn)

## Path Aliases

TypeScript path aliases are configured for cleaner imports:

- `@/*` maps to `src/*` (configured in `tsconfig.json`)

**Example:**

```typescript
import Base from "@/layouts/Base.astro";
import { getCollection } from "astro:content";
```

## Environment Variables

### `PUBLIC_PLAUSIBLE_DOMAIN`

Domain for Plausible analytics (e.g., `"zen.ark"`).

- **Required for production analytics**
- Set in Vercel dashboard under project settings → Environment Variables
- Plausible script only loads when `import.meta.env.PROD === true`
- In development (`pnpm dev`), analytics are disabled

## Project Structure

```
zen-ark/
├── public/               # Static assets (favicon, og.jpg, etc.)
├── src/
│   ├── components/       # React components (ProjectCard, PostCard, etc.)
│   ├── content/
│   │   ├── config.ts     # Content Collections schema
│   │   ├── projects/     # MDX project case studies
│   │   └── posts/        # MDX blog posts
│   ├── layouts/          # Astro layouts (Base, ProjectLayout)
│   │   └── partials/     # Header, Footer components
│   ├── lib/              # Utilities (SEO, schemas)
│   ├── pages/            # Routes (EN default)
│   │   ├── de/           # German localization
│   │   ├── api/          # API routes
│   │   ├── projects/     # Project pages
│   │   └── index.astro   # Homepage
│   └── styles/           # Global CSS + design tokens
│       ├── global.css    # Tailwind + custom utilities
│       └── tokens.css    # CSS custom properties
├── astro.config.mjs      # Astro configuration
├── tailwind.config.ts    # Tailwind configuration (TypeScript)
├── eslint.config.js      # ESLint flat config
├── .prettierrc           # Prettier configuration
├── tsconfig.json         # TypeScript configuration
└── vercel.json           # Vercel deployment config
```

## Localization

- **English**: `/` (default)
- **German**: `/de/*`

Language switcher is included in the header of all pages. The `lang` attribute is set on the `<html>` element based on the current locale.

**Future:** Consider Astro i18n routing or a content translation strategy for scaling to additional languages.

## Commit Conventions

Use conventional commit format: `type(scope): short description`

**Examples:**

- `feat(projects): add Zen Intelligence MDX`
- `fix(layout): correct header spacing`
- `docs(readme): update deployment guide`
- `style(global): adjust typography scale`
- `refactor(api): simplify error handling`

**Common types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Pre-commit Checklist

Before committing:

1. Run `pnpm lint` and fix any warnings
2. Run `pnpm format` for consistent code style
3. Test key pages locally (`pnpm dev`)

**Future:** Add Husky for automated pre-commit hooks to enforce linting and formatting.

## Performance Targets (Lighthouse)

Target scores for production builds:

- **Performance** ≥ 95
- **Accessibility** ≥ 95
- **Best Practices** ≥ 95
- **SEO** ≥ 95

**How to verify:**

1. Run `pnpm build && pnpm preview`
2. Open Chrome DevTools → Lighthouse
3. Run audit on key pages (homepage, project detail)

## Deployment (Vercel)

### Branch Strategy

- **Push any branch** → Vercel creates a preview deployment
- **Merge to `main`** → Production deployment (zero-downtime)

### Environment Variables

Set in Vercel dashboard (Settings → Environment Variables):

| Variable                  | Value     | Environment |
| ------------------------- | --------- | ----------- |
| `PUBLIC_PLAUSIBLE_DOMAIN` | `zen.ark` | Production  |

**Note:** Preview deployments inherit production environment variables by default. Plausible is disabled in development mode regardless.

### Security Headers

Configured in `vercel.json`:

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`

**Future:** Add CSP (Content Security Policy) headers for enhanced security.

### Cache Strategy

Static assets in `/public/*` are cached automatically by Vercel's CDN. Adjust cache headers in `vercel.json` if needed.

### Zero-Downtime Deployment

Vercel handles zero-downtime deployments automatically:

1. New version is built and deployed to a new instance
2. Health checks pass
3. Traffic is gradually shifted to the new version
4. Old version is decommissioned

## Content Management

### Adding a Project

1. Create a new `.mdx` file in `src/content/projects/`
2. Add frontmatter matching the schema in `src/content/config.ts`
3. Write the project content in MDX (supports React components)
4. (Optional) Add images to `src/assets/projects/[project-name]/`

**Example:**

```mdx
---
title: "Project Name"
date: "2025-10-25"
year: 2025
client: "Client Name"
summary: "Brief description for listings and meta tags"
services: ["Design", "Development", "Strategy"]
tags: ["Design", "Development"]
cover: "/images/projects/project-name/cover.jpg"
roles: ["Lead Designer", "Frontend Developer"]
tech: ["Astro", "React", "TypeScript"]
links:
  demo: "https://example.com"
  repo: "https://github.com/example/project"
status: "live"
featured: true
---

## Overview

Project details here...
```

**Note:** The `slug` is auto-generated from the filename (e.g., `project-name.mdx` → slug: `project-name`)

### Adding a Blog Post

1. Create a new `.mdx` file in `src/content/posts/`
2. Add frontmatter with title, slug, date, excerpt, tags
3. Write the post content in MDX

**Example:**

```mdx
---
title: "Post Title"
date: "2025-10-25"
tags: ["Design", "Development"]
excerpt: "Brief excerpt for post listing"
author: "ZEN.ARK"
published: true
---

## Introduction

Post content here...
```

**Note:** The `slug` is auto-generated from the filename (e.g., `post-title.mdx` → slug: `post-title`)

### Content Collections Schema

**Projects:**

- `title` (string, required)
- `date` (string, required)
- `year` (number, optional)
- `client` (string, optional)
- `summary` (string, required)
- `services` (array of strings)
- `tags` (array of strings)
- `cover` (string, optional)
- `hero` (image, optional)
- `gallery` (array of images)
- `roles` (array of strings)
- `tech` (array of strings)
- `links.demo` (URL, optional)
- `links.repo` (URL, optional)
- `status` (enum: `live` | `beta` | `archived`)
- `featured` (boolean, default: false)

**Posts:**

- `title` (string, required)
- `date` (string, required)
- `tags` (array of strings)
- `excerpt` (string, required)
- `coverImage` (image, optional)
- `author` (string, default: "ZEN.ARK")
- `published` (boolean, default: true)

## Accessibility

The site follows WCAG 2.1 Level AA standards:

- ✅ Semantic HTML structure
- ✅ Keyboard navigation support
- ✅ ARIA attributes where appropriate
- ✅ Color contrast ratios meet AA standards
- ✅ Focus states visible on all interactive elements
- ✅ Alt text for images
- ✅ Language attribute set on `<html>`

## Design System

The project uses CSS custom properties for design tokens defined in `src/styles/tokens.css`:

- **Colors**: Brand, surface, text (semantic naming)
- **Spacing**: Consistent scale (4px to 96px)
- **Typography**: Font sizes, line heights, letter spacing
- **Radii**: Border radius values
- **Transitions**: Animation durations

Tailwind CSS is configured to extend these tokens for utility classes.

## SEO & Structured Data

The site includes comprehensive SEO optimizations:

- **Meta tags**: Title, description, canonical URLs
- **Open Graph**: Full OG and Twitter Card support
- **Schema.org**: Organization, WebSite, and Article schemas
- **Sitemap**: Auto-generated via `@astrojs/sitemap`
- **Robots.txt**: Dynamic generation

SEO utilities are located in `src/lib/seo.ts` for reuse across pages.

## Future Enhancements

- [ ] **Blog system** with post listing page
- [ ] **Supabase** integration for dynamic features
- [ ] Full **i18n** with content translation (not just UI)
- [ ] **CSP headers** for enhanced security
- [ ] **Husky** pre-commit hooks (lint + format)
- [ ] **Dark/light mode** toggle (currently dark-only)
- [ ] **View transitions** for smoother navigation

## Troubleshooting

### Build Errors

**TypeScript errors:**

```bash
pnpm build
# Fix any type errors shown
```

**ESLint warnings:**

```bash
pnpm lint
# Address warnings before committing
```

### Development Issues

**Port already in use:**

```bash
# Astro default port is 4321
# Kill the process or use a different port:
pnpm dev -- --port 3000
```

**Missing dependencies:**

```bash
pnpm install
```

**Clearing cache:**

```bash
rm -rf node_modules/.astro dist .astro
pnpm install
pnpm build
```

## Support

For questions or issues:

- Email: hello@zen.ark
- Check Astro docs: https://docs.astro.build
- Check React docs: https://react.dev
- Check Tailwind docs: https://tailwindcss.com

---

Built with precision by ZEN.ARK.
