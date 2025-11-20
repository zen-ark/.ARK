import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== "string") {
      return new Response(JSON.stringify({ error: "Missing or invalid message" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true, echo: message }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Invalid JSON body", details: String(error) }),
      {
        status: 400,
        headers: { "content-type": "application/json" },
      },
    );
  }
};

