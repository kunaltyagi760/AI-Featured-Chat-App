const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const sendMessage = async (message, conversationHistory) => {
  const messages = [
    {
      role: "system",
      content:
        "You are a helpful AI assistant. Be concise and clear in your responses."
    },
    ...conversationHistory,
    { role: "user", content: message }
  ];

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: messages,
        temperature: 0.7,
        max_tokens: 1024
      })
    }
  );

  if (!response.ok) {
    throw new Error("Failed to get response from Groq API");
  }

  const data = await response.json();
  return {
    id: Date.now(),
    text: data.choices[0].message.content,
    sender: "bot",
    timestamp: new Date().toISOString()
  };
};

export default sendMessage;