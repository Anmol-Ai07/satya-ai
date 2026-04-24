export async function POST(req) {
  try {
    const { prompt } = await req.json();

    // URL detect (simple)
    const urlMatch = prompt.match(/https?:\/\/\S+/i);
    const url = urlMatch ? urlMatch[0] : null;

    const system = `
You are Satya AI (created by Anmol Singh).

Task:
- If a URL is provided, analyze that link using web knowledge.
- Use Google Search grounding to fetch recent info.
- Decide: REAL / FAKE / MISLEADING / UNVERIFIED.

Return ONLY valid JSON (no markdown):

{
  "verdict": "REAL or FAKE or MISLEADING or UNVERIFIED",
  "confidence": 0-100,
  "summary": "2-3 line summary of the content/topic",
  "truth": "What is actually true (fact-based)",
  "manipulation": "If misleading/edited, explain how",
  "sources": ["source 1","source 2","source 3"],
  "talk": "Explain like a human (simple Hinglish/English mix)",
  "creator": "Built by Anmol Singh"
}
`;

    // अगर link है तो उसे include करके query मजबूत बनाओ
    const userQuery = url
      ? `Analyze this link and claim:\nURL: ${url}\n\nUser text: ${prompt}`
      : `Analyze this claim:\n${prompt}`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: system + "\n\n" + userQuery }],
            },
          ],
          // 👇 Google Search grounding (important)
          tools: [{ google_search: {} }],
        }),
      }
    );

    const data = await res.json();

    // text निकालो
    const raw =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // ```json fences हटाओ
    const cleaned = raw.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return Response.json({
        error: "AI JSON parse failed",
        raw: cleaned,
      });
    }

    return Response.json(parsed);
  } catch (err) {
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}