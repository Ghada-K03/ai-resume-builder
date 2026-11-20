/*global process*/
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { resumeId } = req.body ?? {};

  if (!resumeId) {
    return res.status(400).json({ message: "Resume ID is required" });
  }

  const groqKey = process.env.GROQ_API_KEY;

  if (!groqKey) {
    return res.status(500).json({ message: "Groq API key is missing" });
  }

  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const response = await fetch(
      `https://smart-store.devamer.online/cv/resumes/${encodeURIComponent(resumeId)}/analyze`,
      {
        method: "POST",
        headers: {
          Authorization: authorization,
          "X-Groq-Api-Key": groqKey,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      },
    );

    const data = await response.json();

    return res.status(response.status).json(data);
  } catch {
    return res.status(502).json({
      message: "Unable to connect to the analysis server",
    });
  }
}
