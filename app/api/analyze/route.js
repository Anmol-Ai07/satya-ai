export async function POST(req) {
  try {
    const { prompt } = await req.json();

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: `Fact check this: ${prompt}` }],
            },
          ],
        }),
      }
    );

    const data = await res.json();

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    return Response.json({
      verdict: "UNVERIFIED",
      confidence: 70,
      summary: text,
    });
  } catch (err) {
    return Response.json({ error: "API failed" });
  }
}