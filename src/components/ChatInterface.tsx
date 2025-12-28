import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatMessage } from '@/types/skillpilot';
import { streamChat } from '@/lib/aiService';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ChatInterfaceProps {
  skill: string;
}

export function ChatInterface({ skill }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hi! 👋 I'm your SkillPilot AI teacher. I'm here to help you learn **${skill}**.\n\nFeel free to ask me anything:\n- Explain a concept\n- Suggest practice exercises\n- Help debug your code\n- Recommend resources\n\nWhat would you like to learn today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userInput = input.trim();
    setInput('');
    setIsLoading(true);

    // Create assistant message placeholder
    const assistantMessageId = (Date.now() + 1).toString();
    setMessages((prev) => [...prev, {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    }]);

    let assistantContent = '';

    await streamChat({
      messages: messages
        .filter(m => m.id !== '1') // Exclude initial greeting
        .map(m => ({ role: m.role, content: m.content }))
        .concat([{ role: 'user', content: userInput }]),
      skill,
      onDelta: (text) => {
        assistantContent += text;
        setMessages((prev) => 
          prev.map(m => 
            m.id === assistantMessageId 
              ? { ...m, content: assistantContent } 
              : m
          )
        );
      },
      onDone: () => {
        setIsLoading(false);
      },
      onError: (error) => {
        setIsLoading(false);
        toast.error(error);
        // Remove empty assistant message
        setMessages((prev) => prev.filter(m => m.id !== assistantMessageId));
      },
    });
  };

  const quickQuestions = [
    "I'm stuck, help!",
    "What should I learn next?",
    "Suggest a project",
    "Explain this concept",
  ];

  return (
    <div className="flex flex-col h-full bg-card rounded-xl border shadow-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-secondary/30">
        <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
          <Bot className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-semibold">AI Teacher</h3>
          <p className="text-xs text-muted-foreground">Ask me anything about {skill}</p>
        </div>
        <div className="ml-auto flex items-center gap-1 text-xs text-accent">
          <Sparkles className="h-3 w-3" />
          <span>AI Powered</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3 animate-fade-in",
              message.role === 'user' ? 'flex-row-reverse' : ''
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
              message.role === 'assistant' 
                ? "gradient-primary" 
                : "bg-secondary"
            )}>
              {message.role === 'assistant' ? (
                <Bot className="h-4 w-4 text-primary-foreground" />
              ) : (
                <User className="h-4 w-4 text-secondary-foreground" />
              )}
            </div>
            <div className={cn(
              "max-w-[80%] rounded-2xl px-4 py-3",
              message.role === 'assistant' 
                ? "bg-secondary/50 rounded-tl-md" 
                : "gradient-primary text-primary-foreground rounded-tr-md"
            )}>
              <div className={cn(
                "text-sm whitespace-pre-wrap",
                message.role === 'assistant' && "prose prose-sm max-w-none"
              )}>
                {message.content.split('\n').map((line, i) => (
                  <p key={i} className={i > 0 ? 'mt-2' : ''}>
                    {line.startsWith('**') && line.endsWith('**') ? (
                      <strong>{line.slice(2, -2)}</strong>
                    ) : line.startsWith('• ') ? (
                      <span className="block pl-2">• {line.slice(2)}</span>
                    ) : line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ') || line.startsWith('5. ') ? (
                      <span className="block pl-2">{line}</span>
                    ) : (
                      line
                    )}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && messages[messages.length - 1]?.content === '' && (
          <div className="flex gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
              <Bot className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="bg-secondary/50 rounded-2xl rounded-tl-md px-4 py-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      <div className="px-4 py-2 border-t bg-secondary/20">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {quickQuestions.map((question) => (
            <button
              key={question}
              onClick={() => setInput(question)}
              className="shrink-0 px-3 py-1.5 text-xs rounded-full bg-secondary hover:bg-primary/10 hover:text-primary transition-colors"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t bg-background">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your AI teacher anything..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
