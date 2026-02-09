export default async function handler(req, res) {
  // Only POST allowed
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { model, payload } = req.body;

    // Basic validation
    if (!model || !payload) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    // API key from Vercel Environment Variable
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      return res.status(500).json({ error: "API key not configured" });
    }

    // Call Google Gemini API (server-side)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );

    const data = await response.json();

    // Forward Gemini error if any
    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    // Success
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({
      error: "Server error",
      details: err.message
    });
  }
}
