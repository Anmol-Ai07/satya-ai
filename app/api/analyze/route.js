export async function POST(req) {
  try {
    const { prompt } = await req.json();

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
Return ONLY JSON (no extra text):

{
 "verdict": "",
 "confidence": 0,
 "summary": "",
 "truth": "",
 "manipulation": ""
}

Text: ${prompt}
                  `,
                },
              ],
            },
          ],
          tools: [{ google_search: {} }],
        }),
      }
    );

    const data = await res.json();

    let text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // cleanup
    text = text.replace(/```json|```/g, "").trim();

    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch {
      // fallback if AI fails
      parsed = {
        verdict: "UNVERIFIED",
        confidence: 50,
        summary: text,
        truth: "Could not parse structured response",
        manipulation: "AI returned invalid JSON",
      };
    }

    return Response.json(parsed);
  } catch (err) {
    return Response.json({ error: err.message });
  }
}