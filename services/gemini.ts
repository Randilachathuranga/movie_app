import { config } from "@/config";

interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

export const callGeminiAPI = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch(
      `${config.gemini.baseUrl}?key=${config.gemini.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data: GeminiResponse = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    }
    
    return "I'm having trouble generating a response right now. Please try again!";
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return "I'm having trouble connecting to the AI service. Please try again later!";
  }
};

export const generateMoviePrompt = (userMessage: string, movieData?: string): string => {
  let prompt = `You are a helpful movie assistant chatbot. Your job is to help users discover movies, provide recommendations, and answer questions about films.

User message: "${userMessage}"

`;

  if (movieData) {
    prompt += `Here's some relevant movie data from TMDB:
${movieData}

Please use this movie data to provide a helpful and engaging response about these movies. Include movie titles, ratings, release years, and brief descriptions when relevant.`;
  } else {
    prompt += `Please provide a helpful response about movies based on the user's message. You can:
- Recommend movies based on genres, actors, or themes
- Explain movie plots or provide movie information
- Help users find movies to watch
- Answer general movie-related questions

Keep your response conversational, helpful, and focused on movies. If you don't have specific movie data, provide general movie recommendations or ask for more details about what they're looking for.`;
  }

  prompt += `

Please respond in a friendly, conversational tone and keep your response concise (2-4 sentences maximum unless providing a list).`;

  return prompt;
};
