export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method_not_allowed" });
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "server_not_configured", message: "OPENAI_API_KEY não configurada." });
  const prompt = req.body?.prompt;
  if (typeof prompt !== "string" || !prompt.trim()) return res.status(400).json({ error: "invalid_prompt", message: "Prompt inválido." });
  try {
    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
      body: JSON.stringify({ model: process.env.OPENAI_MODEL || "gpt-6-sol", input: prompt, store: false })
    });
    const data = await r.json();
    if (!r.ok) {
      const code = r.status === 401 || r.status === 403 ? "openai_auth_error" : r.status === 429 ? "rate_limited" : "openai_error";
      return res.status(r.status).json({ error: code, message: data?.error?.message || "Erro na OpenAI." });
    }
    const text = data.output_text || (data.output || []).flatMap(x => x.content || []).filter(x => x.type === "output_text").map(x => x.text || "").join("");
    return res.status(200).json({ text });
  } catch (e) {
    return res.status(500).json({ error: "openai_error", message: e?.message || "Erro interno." });
  }
}
