/*global process*/
const BACKEND_URL = "https://smart-store.devamer.online";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method not allowed.",
    });
  }

  const groqKey = process.env.GROQ_API_KEY;

  if (!groqKey) {
    return res.status(500).json({
      message: "Groq API key is not configured.",
    });
  }

  const authorization = req.headers.authorization;
  const { resumeId, target_role } = req.body ?? {};

  if (!authorization?.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authentication is required.",
    });
  }

  if (!resumeId || typeof target_role !== "string" || !target_role.trim()) {
    return res.status(400).json({
      message: "Resume ID and target role are required.",
    });
  }

  try {
    const response = await fetch(
      `${BACKEND_URL}/cv/resumes/${encodeURIComponent(resumeId)}/recommendations`,
      {
        method: "POST",
        headers: {
          Authorization: authorization,
          "X-Groq-Api-Key": groqKey,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          target_role: target_role.trim(),
        }),
      },
    );

    const data = await response.text();

    res.status(response.status);

    res.setHeader(
      "Content-Type",
      response.headers.get("content-type") || "application/json",
    );

    return res.send(data);
  } catch (error) {
    console.error("Recommendations failed:", error.message);

    return res.status(502).json({
      message: "Failed to generate recommendations.",
    });
  }
}
