"use client";
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [data, setData] = useState(null);

  const analyze = async () => {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: input }),
    });

    const json = await res.json();
    setData(json);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🔮 Satya AI</h1>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste link or text..."
        style={{ width: "100%", height: 100 }}
      />

      <button onClick={analyze}>Analyze</button>

      {data && (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      )}
    </div>
  );
}