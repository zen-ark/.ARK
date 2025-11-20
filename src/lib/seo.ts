interface MetaOptions {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
}

export function buildMeta(options: MetaOptions) {
  const {
    title,
    description,
    canonical,
    ogImage = "/og.jpg",
    ogType = "website",
    author,
    publishedTime,
    modifiedTime,
    tags,
  } = options;

  const meta = {
    title,
    description,
    canonical,
    ogTitle: title,
    ogDescription: description,
    ogImage,
    ogType,
    author,
    publishedTime,
    modifiedTime,
    tags,
  };

  return meta;
}

interface OrganizationSchema {
  name: string;
  url: string;
  logo?: string;
  sameAs?: string[];
}

export function buildOrganizationSchema(org: OrganizationSchema) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: org.name,
    url: org.url,
    logo: org.logo,
    sameAs: org.sameAs || [],
  };
}

interface WebSiteSchema {
  name: string;
  url: string;
  description: string;
}

export function buildWebSiteSchema(site: WebSiteSchema) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    description: site.description,
  };
}

interface ArticleSchema {
  headline: string;
  description: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  url: string;
}

export function buildArticleSchema(article: ArticleSchema) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.headline,
    description: article.description,
    author: {
      "@type": "Person",
      name: article.author,
    },
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    image: article.image,
    url: article.url,
  };
}

export function formatJsonLd(data: Record<string, any>) {
  return JSON.stringify(data, null, 2);
}

