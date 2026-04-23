export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { idea, subreddit } = req.body;

  if (!idea || !subreddit) {
    return res.status(400).json({ error: "Faltan parámetros" });
  }

  // --- Reddit ---
  let posts = [];
  try {
    const query = encodeURIComponent(idea);
    const redditUrl = `https://www.reddit.com/r/${subreddit}/search.json?q=${query}&limit=5&sort=relevance&restrict_sr=1`;
    const redditRes = await fetch(redditUrl, {
      headers: {
        // Required: Reddit blocks requests without a User-Agent
        "User-Agent": "idea-validator-app/1.0 (by /u/ideavalidator)",
        Accept: "application/json",
      },
    });

    if (redditRes.ok) {
      const redditData = await redditRes.json();
      posts = redditData.data.children
        .map((p) => ({
          title: p.data.title,
          url: `https://reddit.com${p.data.permalink}`,
          selftext: p.data.selftext.slice(0, 300),
        }))
        .slice(0, 3);
    }
    // If Reddit fails, we just continue with empty posts (graceful degradation)
  } catch (err) {
    console.error("Reddit error:", err.message);
  }

  // --- Groq / LLM ---
  const contexto = posts
    .map((p) => `Título: ${p.title}\nTexto: ${p.selftext}`)
    .join("\n\n");

  let analisis = "No pudimos generar el análisis en este momento. Intentá de nuevo.";

  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content:
              "Sos un mentor de startups argentino, optimista pero realista. Analizás ideas basándote en posts de Reddit. Respondé en 3 párrafos cortos: 1) Qué dice la gente 2) Oportunidad o riesgo 3) Próximo paso concreto. Tono canchero pero profesional.",
          },
          {
            role: "user",
            content: `Mi idea: "${idea}"\n\nPosts de Reddit:\n${contexto || "No se encontraron posts similares en esta comunidad."}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 600,
      }),
    });

    if (!groqRes.ok) {
      const errBody = await groqRes.text();
      throw new Error(`Groq ${groqRes.status}: ${errBody}`);
    }

    const groqData = await groqRes.json();
    analisis = groqData.choices[0].message.content;
  } catch (err) {
    console.error("Groq error:", err.message);
  }

  // --- Badge logic (color key, not Tailwind class — safer with purge) ---
  let nivel, titulo, emoji, badgeColor;
  if (posts.length >= 3) {
    nivel = "Tracción Alta";
    titulo = "¡Hay conversación!";
    emoji = "🚀";
    badgeColor = "green";
  } else if (posts.length > 0) {
    nivel = "Despegando";
    titulo = "Hay chispa";
    emoji = "✨";
    badgeColor = "orange";
  } else {
    nivel = "Semilla";
    titulo = "Territorio nuevo";
    emoji = "🌱";
    badgeColor = "sky";
  }

  return res.status(200).json({ nivel, titulo, emoji, badgeColor, posts, analisis });
}
