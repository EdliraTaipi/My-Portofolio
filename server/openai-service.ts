import OpenAI from "openai";

const openai = new OpenAI();

export async function getChatResponse(prompt: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
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
    throw error;
  }
}