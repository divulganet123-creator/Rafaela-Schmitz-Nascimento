export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "server_not_configured",
      message: "OPENAI_API_KEY não configurada."
    });
  }

  const prompt = req.body?.prompt;

  if (typeof prompt !== "string" || !prompt.trim()) {
    return res.status(400).json({
      error: "invalid_prompt",
      message: "Prompt inválido."
    });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5.4-mini",
        input: prompt,
        store: false
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: "openai_error",
        message: data?.error?.message || "Erro ao consultar a OpenAI."
      });
    }

    const text =
      data.output_text ||
      (data.output || [])
        .flatMap(item => item.content || [])
        .filter(item => item.type === "output_text")
        .map(item => item.text || "")
        .join("");

    return res.status(200).json({ text });

  } catch (error) {
    return res.status(500).json({
      error: "internal_error",
      message: error?.message || "Erro interno."
    });
  }
}
