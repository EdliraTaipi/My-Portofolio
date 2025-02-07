import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI();

export async function getChatResponse(prompt: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
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
    return "I apologize, but I'm having trouble connecting to my AI services at the moment. Please try again later.";
  }
}
