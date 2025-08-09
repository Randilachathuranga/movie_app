import { callGeminiAPI, generateMoviePrompt } from "@/services/gemini";
import { useEffect, useRef, useState } from "react";
import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

import { icons } from "@/constants/icons";
import { fetchMovies } from "@/services/api";
import { SafeAreaView } from "react-native-safe-area-context";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your movie assistant. I can help you find movies, get recommendations, and answer questions about films. What would you like to know?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const movieResponses = {
    greeting: [
      "Hello! I'm here to help you discover amazing movies. What genre are you in the mood for?",
      "Hi there! Ready to find your next favorite movie? Ask me anything!",
      "Welcome! I can recommend movies, explain plots, or help you find something to watch tonight."
    ],
    recommendation: [
      "Based on popular trends, I'd recommend checking out action movies like 'Top Gun: Maverick' or sci-fi films like 'Dune'. What genre interests you?",
      "For great entertainment, consider 'Everything Everywhere All at Once' for comedy-drama or 'The Batman' for superhero action!",
      "Looking for something specific? I can suggest movies based on your favorite actors, directors, or genres."
    ],
    genres: [
      "Popular genres include Action, Comedy, Drama, Horror, Sci-Fi, Romance, and Thriller. Which one catches your interest?",
      "I can help you explore any genre! From heartwarming comedies to edge-of-your-seat thrillers.",
      "Each genre offers unique experiences. Action for excitement, drama for emotion, comedy for laughs - what's your mood?"
    ],
    general: [
      "That's an interesting question about movies! While I'd love to help more specifically, you might want to check movie databases for detailed information.",
      "Great movie question! For the most accurate and up-to-date information, I'd recommend checking official movie sources.",
      "Movies are fascinating! Each film has its own unique story and production details worth exploring."
    ]
  };

  const getRandomResponse = (category: keyof typeof movieResponses) => {
    const responses = movieResponses[category];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const generateResponse = async (userMessage: string): Promise<string> => {
    const lowerMessage = userMessage.toLowerCase();
    
    try {
      // Check if user is asking for specific movie search
      let movieData = "";
      
      if (lowerMessage.includes('search') || lowerMessage.includes('find') || 
          lowerMessage.includes('recommend') || lowerMessage.includes('suggest') ||
          lowerMessage.includes('action') || lowerMessage.includes('comedy') || 
          lowerMessage.includes('drama') || lowerMessage.includes('horror') ||
          lowerMessage.includes('sci-fi') || lowerMessage.includes('romance') ||
          lowerMessage.includes('thriller')) {
        
        // Extract search query
        let searchQuery = userMessage.replace(/search|find|movie|look for|about|recommend|suggest/gi, '').trim();
        
        // Handle genre requests
        if (lowerMessage.includes('action')) searchQuery = 'action';
        else if (lowerMessage.includes('comedy')) searchQuery = 'comedy';
        else if (lowerMessage.includes('drama')) searchQuery = 'drama';
        else if (lowerMessage.includes('horror')) searchQuery = 'horror';
        else if (lowerMessage.includes('sci-fi') || lowerMessage.includes('science fiction')) searchQuery = 'science fiction';
        else if (lowerMessage.includes('romance')) searchQuery = 'romance';
        else if (lowerMessage.includes('thriller')) searchQuery = 'thriller';
        else if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest')) searchQuery = 'popular';
        
        // Handle specific movie titles
        const movieTitles = ['batman', 'spider', 'avengers', 'star wars', 'harry potter', 'lord of the rings', 'marvel', 'dc'];
        const foundTitle = movieTitles.find(title => lowerMessage.includes(title));
        if (foundTitle) searchQuery = foundTitle;
        
        // Fetch movie data if we have a search query
        if (searchQuery) {
          try {
            const movies = await fetchMovies({ query: searchQuery });
            if (movies && movies.length > 0) {
              const topMovies = movies.slice(0, 5);
              movieData = topMovies.map((movie, index) => 
                `${index + 1}. ${movie.title} (${movie.release_date?.split('-')[0] || 'N/A'}) - Rating: ${movie.vote_average}/10\n   Plot: ${movie.overview || 'No plot available'}`
              ).join('\n\n');
            }
          } catch (error) {
            console.error('Error fetching movie data:', error);
          }
        }
      }
      
      // Generate prompt and call Gemini API
      const prompt = generateMoviePrompt(userMessage, movieData);
      const response = await callGeminiAPI(prompt);
      
      return response;
      
    } catch (error) {
      console.error('Error generating AI response:', error);
      // Fallback to basic responses if AI fails
      return getFallbackResponse(lowerMessage);
    }
  };
  
  const getFallbackResponse = (lowerMessage: string): string => {
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return getRandomResponse('greeting');
    } else if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest')) {
      return getRandomResponse('recommendation');
    } else if (lowerMessage.includes('genre')) {
      return getRandomResponse('genres');
    } else {
      return getRandomResponse('general');
    }
  };

  const sendMessage = async () => {
    if (inputText.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // Generate response using the API
      const responseText = await generateResponse(userMessage.text);
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting to the movie database. Please try again!",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const renderMessage = (message: Message) => (
    <View key={message.id} className={`mb-4 ${message.isUser ? 'items-end' : 'items-start'}`}>
      <View className={`max-w-[80%] p-3 rounded-2xl ${
        message.isUser 
          ? 'bg-light-100 rounded-br-md' 
          : 'bg-accent rounded-bl-md'
      }`}>
        <Text className={`text-base ${message.isUser ? 'text-secondary' : 'text-white'}`}>
          {message.text}
        </Text>
      </View>
      <Text className="text-light-300 text-xs mt-1">
        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="bg-primary flex-1">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center p-4 border-b border-accent">
          <View className="w-10 h-10 bg-accent rounded-full items-center justify-center mr-3">
            <Image source={icons.arrow} className="w-5 h-5" tintColor="#D6C6FF" />
          </View>
          <View className="flex-1">
            <Text className="text-white text-lg font-semibold">Movie Assistant</Text>
            <Text className="text-light-300 text-sm">Online</Text>
          </View>
        </View>

        {/* Messages */}
        <ScrollView 
          ref={scrollViewRef}
          className="flex-1 px-4 py-4"
          showsVerticalScrollIndicator={false}
        >
          {messages.map(renderMessage)}
          
          {isTyping && (
            <View className="items-start mb-4">
              <View className="bg-accent p-3 rounded-2xl rounded-bl-md">
                <Text className="text-light-300">Typing...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <View className="flex-row items-center p-4 border-t border-accent mb-12">
          <View className="flex-1 bg-accent rounded-full px-4 py-2 mr-3">
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask about movies..."
              placeholderTextColor="#A8B5DB"
              className="text-white text-base"
              multiline
              onSubmitEditing={sendMessage}
              returnKeyType="send"
            />
          </View>
          <TouchableOpacity 
            onPress={sendMessage}
            className="w-10 h-10 bg-light-100 rounded-full items-center justify-center"
          >
            <Image source={icons.arrow} className="w-5 h-5" tintColor="#030014" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Chatbot;