import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileText, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

const Admin = () => {
  const { toast } = useToast();
  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      id: "1",
      question: "What are your business hours?",
      answer: "We're open 24/7 with AI support, and human agents are available Monday-Friday, 9 AM - 6 PM EST.",
    },
  ]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");

  const handleAddFAQ = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both question and answer fields.",
        variant: "destructive",
      });
      return;
    }

    const newFAQ: FAQ = {
      id: Date.now().toString(),
      question: newQuestion.trim(),
      answer: newAnswer.trim(),
    };

    setFaqs((prev) => [...prev, newFAQ]);
    setNewQuestion("");
    setNewAnswer("");

    toast({
      title: "Success",
      description: "FAQ added successfully!",
    });
  };

  const handleDeleteFAQ = (id: string) => {
    setFaqs((prev) => prev.filter((faq) => faq.id !== id));
    toast({
      title: "Deleted",
      description: "FAQ removed successfully.",
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast({
        title: "File Selected",
        description: `${file.name} is ready to upload. In production, this would be processed and stored.`,
      });
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your AI assistant's knowledge base and training data
        </p>
      </div>

      <Tabs defaultValue="faqs" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="faqs" className="space-y-6">
          {/* Add New FAQ */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New FAQ
              </CardTitle>
              <CardDescription>Create frequently asked questions for your AI assistant</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="question">Question</Label>
                <Input
                  id="question"
                  placeholder="Enter the question..."
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="answer">Answer</Label>
                <Textarea
                  id="answer"
                  placeholder="Enter the answer..."
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  rows={4}
                />
              </div>
              <Button onClick={handleAddFAQ} className="bg-gradient-primary hover:opacity-90 transition-opacity">
                Add FAQ
              </Button>
            </CardContent>
          </Card>

          {/* Existing FAQs */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>Existing FAQs</CardTitle>
              <CardDescription>Manage your knowledge base questions and answers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {faqs.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No FAQs added yet</p>
              ) : (
                faqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="flex gap-4 rounded-lg border p-4 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1 space-y-2">
                      <h4 className="font-medium">{faq.question}</h4>
                      <p className="text-sm text-muted-foreground">{faq.answer}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteFAQ(faq.id)}
                      className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Documents
              </CardTitle>
              <CardDescription>
                Upload PDFs, Word documents, or text files to expand your AI's knowledge
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-accent/50 hover:bg-accent/70 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FileText className="w-12 h-12 mb-4 text-muted-foreground" />
                    <p className="mb-2 text-sm text-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">PDF, DOC, DOCX, or TXT (MAX. 10MB)</p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
              <p className="text-sm text-muted-foreground">
                Note: This is a demo interface. In production, files would be processed and stored in MongoDB.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
