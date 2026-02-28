import type { APIRoute } from "astro";
import { 
  analyzeSchemaDensity, 
  analyzeSignalToNoise, 
  analyzeEntityClarity, 
  analyzeSitemap,
  calculateTotalScore
} from "../../lib/aeo-analyzer";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json().catch(() => ({}));
    const { url } = body;

    // Log the request body for debugging
    console.log("AEO Scan Request Body:", body);

    if (!url || typeof url !== "string") {
      return new Response(JSON.stringify({ error: "Missing or invalid URL" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    // Basic URL validation
    let targetUrl: URL;
    try {
      targetUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
    } catch (e) {
      return new Response(JSON.stringify({ error: "Invalid URL format" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    // Fetch HTML with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

    let html = '';
    let sitemapXml = '';
    let sitemapStatus = 404;

    try {
      const response = await fetch(targetUrl.toString(), {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; AEO-Scanner/1.0; +https://ark-studio.ch)'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch site: ${response.status} ${response.statusText}`);
      }

      html = await response.text();

      // Try to fetch sitemap
      try {
        const sitemapUrl = new URL('/sitemap.xml', targetUrl).toString();
        const sitemapResponse = await fetch(sitemapUrl, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; AEO-Scanner/1.0; +https://ark-studio.ch)'
          }
        });
        sitemapStatus = sitemapResponse.status;
        if (sitemapResponse.ok) {
          sitemapXml = await sitemapResponse.text();
        }
      } catch (e) {
        // Sitemap fetch failed, treat as 404/error but don't fail main scan
        console.warn("Sitemap fetch failed", e);
      }

    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        return new Response(JSON.stringify({ error: "Scan timed out (site too slow)" }), {
          status: 504,
          headers: { "content-type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: `Could not access site: ${error.message}` }), {
        status: 502,
        headers: { "content-type": "application/json" },
      });
    } finally {
      clearTimeout(timeoutId);
    }

    // Run Analysis
    const schemaScore = analyzeSchemaDensity(html);
    const signalScore = analyzeSignalToNoise(html);
    const entityScore = analyzeEntityClarity(html);
    const sitemapScore = analyzeSitemap(sitemapXml, sitemapStatus);

    const result = calculateTotalScore(
      schemaScore,
      signalScore,
      entityScore,
      sitemapScore
    );

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 
        "content-type": "application/json",
        "Cache-Control": "s-maxage=60, stale-while-revalidate=30"
      },
    });

  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Internal Server Error", details: String(error) }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      },
    );
  }
};
