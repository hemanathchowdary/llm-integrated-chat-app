import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Zap, Shield, Upload, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Home = () => {
  const { isAdmin } = useAuth();
  const features = [
    {
      icon: MessageSquare,
      title: "AI-Powered Chat",
      description: "Intelligent responses powered by advanced language models",
    },
    {
      icon: Zap,
      title: "Instant Answers",
      description: "Get quick, accurate answers to customer queries 24/7",
    },
    {
      icon: Upload,
      title: "Custom Knowledge",
      description: "Upload FAQs and documents to train your AI assistant",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with chat history storage",
    },
  ];

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm text-muted-foreground animate-fade-in">
          <Zap className="mr-2 h-3 w-3 text-primary" />
          AI-Powered Customer Support Platform
        </div>
        
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl animate-slide-up">
          Transform Your
          <span className="block mt-2 bg-gradient-primary bg-clip-text text-transparent">
            Customer Support
          </span>
        </h1>
        
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground animate-slide-up [animation-delay:0.1s]">
          Deliver exceptional customer experiences with an AI assistant that learns from your
          knowledge base and provides instant, accurate responses.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 animate-slide-up [animation-delay:0.2s]">
          <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90 transition-opacity">
            <Link to="/chat">
              Start Chatting
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          {isAdmin && (
            <Button asChild size="lg" variant="outline">
              <Link to="/admin">Admin Dashboard</Link>
            </Button>
          )}
        </div>
      </section>

      {/* Features Grid */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Powerful Features</h2>
          <p className="text-muted-foreground">Everything you need for intelligent customer support</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="group hover:shadow-medium transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-light group-hover:bg-gradient-primary transition-all duration-300">
                    <Icon className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="rounded-2xl bg-gradient-hero border p-8 md:p-12 text-center space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Ready to Get Started?</h2>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          {isAdmin
            ? "Experience the power of AI-driven customer support. Start chatting now or set up your knowledge base in the admin panel."
            : "Experience the power of AI-driven customer support. Start chatting now and let your admin handle the knowledge base setup."}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90 transition-opacity">
            <Link to="/chat">
              Try Chat Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          {isAdmin && (
            <Button asChild size="lg" variant="outline">
              <Link to="/admin">Open Admin Panel</Link>
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
