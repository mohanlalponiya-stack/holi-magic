export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "Image missing" });
    }

    const HF_TOKEN = process.env.HF_TOKEN;
    if (!HF_TOKEN) {
      return res.status(500).json({ error: "HF token not set" });
    }

    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-inpainting",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: "Add vibrant Holi colors on face and clothes, festive Indian Holi background, realistic photo",
          image: imageBase64
        })
      }
    );

    if (!response.ok) {
      const t = await response.text();
      return res.status(500).json({ error: t });
    }

    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");

    res.status(200).json({
      image: `data:image/png;base64,${base64}`
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
