import { Bot } from "lucide-react";

export const TypingIndicator = () => {
  return (
    <div className="flex items-start gap-3 animate-slide-up">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent">
        <Bot className="h-4 w-4 text-accent-foreground" />
      </div>
      <div className="flex items-center gap-1 rounded-2xl bg-card border px-4 py-3 shadow-soft">
        <div className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse" />
        <div className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse [animation-delay:0.2s]" />
        <div className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse [animation-delay:0.4s]" />
      </div>
    </div>
  );
};
