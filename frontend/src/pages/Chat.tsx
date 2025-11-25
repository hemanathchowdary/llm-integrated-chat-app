import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { ChatInput } from "@/components/chat/ChatInput";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your AI support assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thank you for your message! I'm currently in demo mode. In a production environment, I would connect to an AI service like OpenAI, Gemini, or Claude to provide intelligent responses based on your uploaded knowledge base.",
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <Card className="shadow-medium">
        <CardHeader className="border-b bg-gradient-hero">
          <CardTitle className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            AI Support Chat
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px] p-6">
            <div className="space-y-4">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message.text}
                  isUser={message.isUser}
                  timestamp={message.timestamp}
                />
              ))}
              {isTyping && <TypingIndicator />}
            </div>
          </ScrollArea>
          <div className="border-t p-4 bg-card">
            <ChatInput onSend={handleSendMessage} disabled={isTyping} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chat;
