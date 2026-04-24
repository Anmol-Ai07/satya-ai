"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);

  const send = async () => {
    const res = await fetch("/api/analyze", {
      method: "POST",
      body: JSON.stringify({ prompt: input })
    });

    const data = await res.json();
    setResult(data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Satya AI 🔥</h1>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask anything..."
      />

      <br /><br />

      <button onClick={send}>Analyze</button>

      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}