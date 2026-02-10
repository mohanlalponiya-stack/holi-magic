export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const HF_TOKEN = process.env.HF_TOKEN;

  // 🔴 यही लाइन तुमने बोली थी – add की गई है
  if (!HF_TOKEN) {
    return res.status(500).json({ error: "HF API key not set" });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt missing" });
  }

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: prompt
        })
      }
    );

    if (!response.ok) {
      const text = await response.text();
      return res.status(500).json({ error: text });
    }

    const imageBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString("base64");

    res.status(200).json({
      image: `data:image/png;base64,${base64Image}`
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
