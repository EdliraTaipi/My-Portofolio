import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY environment variable is not set");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function getChatResponse(prompt: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", 
      messages: [
        {
          role: "system",
          content: "You are a helpful AI assistant for Edlira's portfolio website. Your role is to help visitors learn about Edlira's skills, projects, and experience. Be professional, friendly, and informative. Focus on highlighting technical expertise and achievements."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return response.choices[0].message.content || "I apologize, but I couldn't generate a response at the moment.";
  } catch (error) {
    console.error('OpenAI API error:', error);
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return "I apologize, but there seems to be an issue with the AI service configuration. Please try again later.";
      } else if (error.message.includes('Rate limit')) {
        return "I'm currently handling too many requests. Please try again in a moment.";
      }
    }
    return "I apologize, but I'm having trouble connecting to my AI services at the moment. Please try again later.";
  }
}