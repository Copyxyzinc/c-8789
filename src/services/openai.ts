
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

export const sendMessageToOpenAI = async (messages: { role: 'user' | 'assistant'; content: string }[]) => {
  try {
    // Get the OpenAI API key from Supabase
    const { data: { secret: openAIKey }, error: secretError } = await supabase
      .rpc('get_secret', { secret_name: 'OPENAI_API_KEY' });

    if (secretError || !openAIKey) {
      console.error("Error getting OpenAI API key:", secretError);
      throw new Error("Failed to get OpenAI API key");
    }

    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openAIKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Using the recommended model
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      throw new Error(errorData.error?.message || "Failed to get response from OpenAI");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error: any) {
    console.error("Error calling OpenAI:", error);
    toast.error(error.message || "Failed to get response from ChatGPT");
    throw error;
  }
};
