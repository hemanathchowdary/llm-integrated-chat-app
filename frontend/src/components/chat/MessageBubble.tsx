import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

interface MessageBubbleProps {
  message: string;
  isUser: boolean;
  timestamp?: string;
}

export const MessageBubble = ({ message, isUser, timestamp }: MessageBubbleProps) => {
  return (
    <div
      className={cn(
        "flex items-start gap-3 animate-slide-up",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isUser ? "bg-primary" : "bg-accent"
        )}
      >
        {isUser ? (
          <User className="h-4 w-4 text-primary-foreground" />
        ) : (
          <Bot className="h-4 w-4 text-accent-foreground" />
        )}
      </div>

      <div
        className={cn(
          "flex max-w-[80%] flex-col gap-1",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 shadow-soft",
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-card border text-card-foreground"
          )}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
        </div>
        {timestamp && (
          <span className="text-xs text-muted-foreground px-2">{timestamp}</span>
        )}
      </div>
    </div>
  );
};
