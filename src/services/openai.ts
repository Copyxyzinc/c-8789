import { toast } from "sonner";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

export const sendMessageToOpenAI = async (messages: { role: 'user' | 'assistant'; content: string }[]) => {
  try {
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to get response from OpenAI");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    toast.error("Failed to get response from ChatGPT");
    throw error;
  }
};