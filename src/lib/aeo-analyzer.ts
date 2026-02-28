import * as cheerio from 'cheerio';

interface ScoringResult {
  score: number;
  details: string[];
}

export interface AEOScanResult {
  totalScore: number;
  breakdown: {
    schemaDensity: number;
    signalToNoise: number;
    entityClarity: number;
    sitemapHealth: number;
  };
  details: string[];
}

/**
 * 1. Schema Density (40 pts)
 * Parse all <script type="application/ld+json"> blocks
 */
export function analyzeSchemaDensity(html: string): ScoringResult {
  const $ = cheerio.load(html);
  const scripts = $('script[type="application/ld+json"]');
  let score = 0;
  const details: string[] = [];
  const foundTypes: Set<string> = new Set();

  scripts.each((_, el) => {
    try {
      const content = $(el).html();
      if (!content) return;
      const json = JSON.parse(content);
      
      // Handle array of schemas or single object
      const items = Array.isArray(json) ? json : [json];
      
      items.forEach(item => {
        const type = item['@type'];
        if (type) {
          if (Array.isArray(type)) {
            type.forEach(t => foundTypes.add(t));
          } else {
            foundTypes.add(type);
          }
        }
        
        // Check for nested graph
        if (item['@graph'] && Array.isArray(item['@graph'])) {
          item['@graph'].forEach((node: any) => {
            if (node['@type']) foundTypes.add(node['@type']);
          });
        }
      });
    } catch (e) {
      details.push("Found invalid JSON-LD block");
    }
  });

  if (foundTypes.size === 0) {
    return { score: 0, details: ["No Schema.org structured data found"] };
  }

  // Scoring Logic
  if (foundTypes.has('Organization') || foundTypes.has('LocalBusiness') || foundTypes.has('Corporation')) {
    score += 15;
    details.push("✅ Organization/LocalBusiness schema found");
  } else {
    details.push("❌ Missing Organization/LocalBusiness schema");
  }

  if (foundTypes.has('Service') || foundTypes.has('Product') || foundTypes.has('Offer')) {
    score += 10;
    details.push("✅ Service/Product schema found");
  }

  if (foundTypes.has('FAQPage')) {
    score += 10;
    details.push("✅ FAQPage schema found");
  }

  // Bonus points for other useful types
  const otherTypes = ['BreadcrumbList', 'WebPage', 'Article', 'BlogPosting', 'HowTo', 'VideoObject'];
  const hasBonus = otherTypes.some(t => foundTypes.has(t));
  if (hasBonus) {
    score += 5;
    details.push("✅ Supporting schema types found");
  }

  return { 
    score: Math.min(40, score), 
    details 
  };
}

/**
 * 2. Signal-to-Noise Ratio (20 pts)
 * Text-to-HTML ratio and Semantic HTML usage
 */
export function analyzeSignalToNoise(html: string): ScoringResult {
  const $ = cheerio.load(html);
  let score = 0;
  const details: string[] = [];

  // Remove scripts, styles, comments for text calculation
  $('script, style, comment').remove();
  const textContent = $('body').text().replace(/\s+/g, ' ').trim();
  const rawHtmlLength = html.length;
  const textLength = textContent.length;
  
  const ratio = rawHtmlLength > 0 ? textLength / rawHtmlLength : 0;
  const ratioPercentage = (ratio * 100).toFixed(1);

  // Text-to-HTML scoring (0-10 pts)
  // > 20% is great (10pts), < 5% is bad (0pts)
  let ratioScore = 0;
  if (ratio >= 0.2) ratioScore = 10;
  else if (ratio <= 0.05) ratioScore = 0;
  else ratioScore = Math.round(((ratio - 0.05) / 0.15) * 10);
  
  score += ratioScore;
  details.push(`Text-to-HTML Ratio: ${ratioPercentage}% (${ratioScore}/10 pts)`);

  // Semantic HTML scoring (0-10 pts)
  const semanticTags = ['main', 'article', 'section', 'nav', 'header', 'footer', 'aside'];
  let semanticCount = 0;
  semanticTags.forEach(tag => {
    semanticCount += $(tag).length;
  });
  const divCount = $('div').length;
  
  const semanticRatio = divCount > 0 ? semanticCount / divCount : 0;
  
  // Ratio > 0.3 is good (10pts), < 0.05 is bad (0pts)
  let semanticScore = 0;
  if (semanticRatio >= 0.3) semanticScore = 10;
  else if (semanticRatio <= 0.05) semanticScore = 0;
  else semanticScore = Math.round(((semanticRatio - 0.05) / 0.25) * 10);

  score += semanticScore;
  details.push(`Semantic Element Usage: ${semanticScore}/10 pts (${semanticCount} semantic vs ${divCount} divs)`);

  return { score: Math.min(20, score), details };
}

/**
 * 3. Entity Clarity (20 pts)
 * H1, Headings, Meta Description, Title
 */
export function analyzeEntityClarity(html: string): ScoringResult {
  const $ = cheerio.load(html);
  let score = 0;
  const details: string[] = [];

  // H1 Check
  const h1Count = $('h1').length;
  if (h1Count === 1) {
    score += 5;
    details.push("✅ Single clear H1 tag found");
  } else if (h1Count === 0) {
    details.push("❌ No H1 tag found");
  } else {
    details.push("⚠️ Multiple H1 tags found (dilutes signal)");
    score += 2; // Partial credit
  }

  // Heading Hierarchy
  const headings = $('h1, h2, h3, h4, h5, h6');
  let lastLevel = 0;
  let skippedLevels = false;
  headings.each((_, el) => {
    const level = parseInt(el.tagName.substring(1));
    if (level > lastLevel + 1) skippedLevels = true;
    lastLevel = level;
  });

  if (!skippedLevels && headings.length > 0) {
    score += 5;
    details.push("✅ Heading hierarchy is logical");
  } else if (headings.length === 0) {
    details.push("❌ No headings found");
  } else {
    details.push("⚠️ Skipped heading levels detected");
  }

  // Meta Description
  const metaDesc = $('meta[name="description"]').attr('content') || '';
  if (metaDesc.length >= 50 && metaDesc.length <= 160) {
    score += 5;
    details.push("✅ Meta description length is optimal");
  } else if (metaDesc.length > 0) {
    details.push("⚠️ Meta description exists but length is suboptimal");
    score += 2;
  } else {
    details.push("❌ Missing meta description");
  }

  // Title Tag
  const title = $('title').text().trim();
  if (title.length >= 20 && title.length <= 70 && title.toLowerCase() !== 'home') {
    score += 5;
    details.push("✅ Title tag is descriptive and optimized");
  } else if (title.length > 0) {
    details.push("⚠️ Title tag exists but length/content is suboptimal");
    score += 2;
  } else {
    details.push("❌ Missing title tag");
  }

  return { score: Math.min(20, score), details };
}

/**
 * 4. Sitemap Health (20 pts)
 * Check sitemap availability and content
 */
export function analyzeSitemap(sitemapXml: string | null, status: number): ScoringResult {
  let score = 0;
  const details: string[] = [];

  if (!sitemapXml || status !== 200) {
    return { score: 0, details: ["❌ Sitemap not found or unreachable"] };
  }

  score += 8;
  details.push("✅ Sitemap found");

  try {
    const $ = cheerio.load(sitemapXml, { xmlMode: true });
    const urls = $('url');
    const urlCount = urls.length;

    if (urlCount > 0) {
      score += 4; // Valid XML with URLs
      details.push(`✅ Valid XML sitemap (${urlCount} URLs)`);
    } else {
      details.push("⚠️ Sitemap XML parsed but no URLs found");
    }

    if (urlCount >= 5) {
      score += 4;
      details.push("✅ Sitemap has sufficient depth");
    }

    // Check for lastmod
    const hasLastMod = $('lastmod').length > 0;
    if (hasLastMod) {
      score += 4;
      details.push("✅ Lastmod dates present");
    } else {
      details.push("⚠️ Missing lastmod dates");
    }

  } catch (e) {
    details.push("❌ Invalid XML format");
  }

  return { score: Math.min(20, score), details };
}

export function calculateTotalScore(
  schema: ScoringResult,
  signal: ScoringResult,
  entity: ScoringResult,
  sitemap: ScoringResult
): AEOScanResult {
  const totalScore = schema.score + signal.score + entity.score + sitemap.score;
  
  // Combine all details into a prioritized list
  const allDetails = [
    ...schema.details,
    ...signal.details,
    ...entity.details,
    ...sitemap.details
  ];

  return {
    totalScore,
    breakdown: {
      schemaDensity: schema.score,
      signalToNoise: signal.score,
      entityClarity: entity.score,
      sitemapHealth: sitemap.score
    },
    details: allDetails
  };
}
