
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

export const sendMessageToOpenAI = async (messages: { role: 'user' | 'assistant'; content: string }[]) => {
  try {
    // Get the OpenAI API key from Supabase
    const { data, error } = await supabase
      .from('secrets')
      .select('value')
      .eq('name', 'OPENAI_API_KEY')
      .single();

    if (error || !data?.value) {
      console.error("Error getting OpenAI API key:", error);
      throw new Error("Failed to get OpenAI API key");
    }

    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.value}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
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

    const responseData = await response.json();
    return responseData.choices[0].message.content;
  } catch (error: any) {
    console.error("Error calling OpenAI:", error);
    toast.error(error.message || "Failed to get response from ChatGPT");
    throw error;
  }
};
