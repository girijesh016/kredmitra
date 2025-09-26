import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage, UserData, SelectedLoan } from '../types';
import { getConversationStarters, ai } from '../services/geminiService';
import { UserIcon } from './icons/UserIcon';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

interface ChatbotProps {
    userData: UserData;
    loan: SelectedLoan;
    mobile: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ userData, loan, mobile }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [starters, setStarters] = useState<string[]>([]);
  const [startersLoading, setStartersLoading] = useState(true);
  
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const chatRef = useRef<Chat | null>(null);

  useEffect(() => {
    const chatHistoryKey = `kredmitra_chat_${mobile}`;
    const storedHistory = localStorage.getItem(chatHistoryKey);
    const initialMessages = storedHistory 
        ? JSON.parse(storedHistory) 
        : [{ sender: 'bot', text: `Hello ${userData.name}! I'm Coach Mitra, your personal financial guide. How can I help you manage your loan or savings today? 😊` }];
    setMessages(initialMessages);

    chatRef.current = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: `You are 'Coach Mitra', a friendly, encouraging AI financial coach from a Multi-Agent System. Your primary agent function is User Engagement & Support.

            **User Context:**
            - Name: ${userData.name}
            - Loan: "${loan.name}" for ₹${loan.amount}

            **Your Core Directives:**
            1.  **Persona:** Simple, positive, empathetic. Use emojis (🙏, 😊, 🌱, 💡). Use simple language and short sentences.
            2.  **Safety:** NEVER give direct financial advice. Frame suggestions as "educational tips."
            3.  **RAG-Powered Answers:** For questions about data privacy, be reassuring and cite our privacy policy.`,
        },
    });

    getConversationStarters(loan)
        .then(setStarters)
        .catch(err => console.error("Could not fetch conversation starters", err))
        .finally(() => setStartersLoading(false));
  }, [loan, mobile, userData]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (messageText: string) => {
    if (messageText.trim() === '' || isLoading || !chatRef.current) return;
    
    const userMessage: ChatMessage = { sender: 'user', text: messageText };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response: GenerateContentResponse = await chatRef.current.sendMessage({ message: messageText });
      const botMessage: ChatMessage = { sender: 'bot', text: response.text };
      const updatedMessages = [...newMessages, botMessage];
      setMessages(updatedMessages);
      localStorage.setItem(`kredmitra_chat_${mobile}`, JSON.stringify(updatedMessages));
    } catch (error) {
      console.error("Chatbot error:", error);
      const errorMessage: ChatMessage = { sender: 'bot', text: "I'm sorry, I'm having a little trouble connecting. Please try again in a moment." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStarterClick = (starter: string) => {
    handleSend(starter);
  };

  return (
    <div className="flex flex-col h-[32rem] bg-white rounded-2xl border border-slate-200/80 shadow-lg">
      <div className="p-4 border-b border-slate-200/80">
        <h3 className="font-bold text-lg text-slate-800">Coach Mitra 🤖</h3>
        <p className="text-sm text-slate-600">Your AI Financial Coach</p>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
             {msg.sender === 'bot' && <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">🤖</div>}
            <div className={`max-w-xs md:max-w-md p-3 rounded-2xl shadow-md ${msg.sender === 'user' ? 'bg-teal-600 text-white rounded-br-none' : 'bg-white text-slate-800 rounded-bl-none'}`}>
              <p className="text-sm" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }} />
            </div>
             {msg.sender === 'user' && <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center flex-shrink-0 shadow-md"><UserIcon className="w-5 h-5" /></div>}
          </div>
        ))}
        {messages.length <= 1 && !startersLoading && starters.length > 0 && (
            <div className="p-2 space-y-2 animate-fade-in-up">
                <p className="text-xs font-semibold text-slate-500 text-center">Conversation Starters</p>
                {starters.map((s, i) => (
                    <button
                        key={i}
                        onClick={() => handleStarterClick(s)}
                        className="w-full text-left text-sm p-2 bg-white/70 hover:bg-teal-50 rounded-lg border border-slate-200/80 transition"
                    >
                        {s}
                    </button>
                ))}
            </div>
        )}
        {isLoading && (
            <div className="flex items-end gap-2 justify-start">
                <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">🤖</div>
                <div className="max-w-xs p-3 rounded-2xl bg-white text-slate-800 rounded-bl-none shadow-md">
                    <div className="flex items-center justify-center space-x-1">
                        <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-slate-200/80 bg-white/30">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder="Ask a financial question..."
            className="flex-1 px-4 py-2 border bg-white border-slate-300 rounded-full focus:ring-2 focus:ring-teal-500 focus:outline-none focus:border-teal-500"
            disabled={isLoading}
          />
          <button onClick={() => handleSend(input)} disabled={isLoading} className="bg-teal-600 text-white rounded-full p-2 hover:shadow-lg disabled:bg-slate-400 disabled:shadow-none transition-all transform hover:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;