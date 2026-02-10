export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const HF_TOKEN = process.env.HF_TOKEN;

  if (!HF_TOKEN) {
    return res.status(500).json({ error: "HF API key not set" });
  }

  try {
    const { prompt } = req.body;

    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    const image = await response.arrayBuffer();

    res.setHeader("Content-Type", "image/png");
    res.send(Buffer.from(image));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
