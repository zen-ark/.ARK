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
  address?: {
    streetAddress: string;
    addressLocality: string;
    postalCode: string;
    addressCountry: string;
  };
  contactPoint?: {
    telephone?: string;
    contactType: string;
    email?: string;
  };
}

export function buildOrganizationSchema(org: OrganizationSchema) {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: org.name,
    url: org.url,
    logo: org.logo,
    sameAs: org.sameAs || [],
  };

  if (org.address) {
    schema.address = {
      "@type": "PostalAddress",
      ...org.address,
    };
  }

  if (org.contactPoint) {
    schema.contactPoint = {
      "@type": "ContactPoint",
      ...org.contactPoint,
    };
  }

  return schema;
}

interface ServiceSchema {
  name: string;
  description: string;
  provider: {
    name: string;
    url: string;
  };
  serviceType: string;
  areaServed?: string;
}

export function buildServiceSchema(service: ServiceSchema) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    provider: {
      "@type": "Organization",
      name: service.provider.name,
      url: service.provider.url,
    },
    serviceType: service.serviceType,
    areaServed: service.areaServed || "Global",
  };
}

interface PersonSchema {
  name: string;
  jobTitle: string;
  url?: string;
  sameAs?: string[];
  worksFor?: {
    name: string;
    url: string;
  };
}

export function buildPersonSchema(person: PersonSchema) {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    jobTitle: person.jobTitle,
    url: person.url,
    sameAs: person.sameAs || [],
  };

  if (person.worksFor) {
    schema.worksFor = {
      "@type": "Organization",
      name: person.worksFor.name,
      url: person.worksFor.url,
    };
  }

  return schema;
}

interface FAQItem {
  question: string;
  answer: string;
}

export function buildFAQPageSchema(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
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

