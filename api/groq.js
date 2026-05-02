export default async function handler(req, res) {
  if (req.method!== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { mood } = req.body;

  if (!mood) {
    return res.status(400).json({ error: 'Mood is required' });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama3-8b-8192", // Fast aur free model
        messages: [{
          role: "system",
          content: "You are a movie expert. Return ONLY a valid JSON array. No extra text, no markdown. Format: [{\"title\":\"Movie Name\",\"year\":2023,\"description\":\"short desc\",\"matchPercentage\":95}]"
        }, {
          role: "user",
          content: `Suggest exactly 3 movies for this mood: ${mood}`
        }],
        temperature: 0.8,
        max_tokens: 500
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.log("Groq API Error:", data);
      return res.status(response.status).json({ error: data.error.message });
    }

    res.status(200).json(data);
  } catch (error) {
    console.log("Server Error:", error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}