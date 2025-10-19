import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { z } from "zod";
import { Code2, Upload as UploadIcon, Sparkles } from "lucide-react";

const snippetSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  code: z.string().min(1, "Code is required").max(10000, "Code too long"),
  language: z.string().min(1, "Language is required"),
});

const Upload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validation = snippetSchema.safeParse({ title, code, language });
      if (!validation.success) {
        toast({
          title: "Validation Error",
          description: validation.error.errors[0].message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      toast({
        title: "Analyzing...",
        description: "AI is analyzing your code",
      });

      const { data: aiData, error: aiError } = await supabase.functions.invoke(
        "analyze-snippet",
        {
          body: { code, language },
        }
      );

      if (aiError) {
        console.error("AI analysis error:", aiError);
      }

      const { error: insertError } = await supabase.from("snippets").insert({
        user_id: user?.id,
        title,
        code,
        language,
        tags: aiData?.tags || [],
        summary: aiData?.summary || null,
        is_public: isPublic,
      });

      if (insertError) throw insertError;

      toast({
        title: "Success!",
        description: "Snippet saved successfully",
      });
      navigate("/dashboard");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1e1e1e]">
      <Navigation user={user} />
      
      <main className="container mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4">
            <div className="p-2 sm:p-3 bg-[#252526] rounded-lg border border-[#3e3e42]">
              <UploadIcon className="h-6 w-6 sm:h-8 sm:w-8 text-[#569cd6]" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#d4d4d4]">Upload Snippet</h1>
              <p className="text-[#9d9d9d] text-sm sm:text-base md:text-lg mt-1 sm:mt-2">Share your code with the community or save for later</p>
            </div>
          </div>
        </div>

        <Card className="max-w-4xl mx-auto p-6 sm:p-8 md:p-10 rounded-lg border border-[#3e3e42] bg-[#252526] shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* Title Field */}
            <div className="space-y-2 sm:space-y-3">
              <Label htmlFor="title" className="text-sm sm:text-base font-semibold text-[#d4d4d4] flex items-center gap-2">
                <Code2 className="h-3 w-3 sm:h-4 sm:w-4 text-[#569cd6]" />
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., React useAuth Hook"
                required
                className="rounded-lg border border-[#3e3e42] bg-[#1e1e1e] text-[#d4d4d4] placeholder:text-[#6a6a6a] focus:border-[#569cd6] focus:ring-1 focus:ring-[#569cd6] h-11 sm:h-12 text-sm sm:text-base transition-all"
              />
            </div>

            {/* Language Field */}
            <div className="space-y-2 sm:space-y-3">
              <Label htmlFor="language" className="text-sm sm:text-base font-semibold text-[#d4d4d4] flex items-center gap-2">
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-[#4ec9b0]" />
                Language
              </Label>
              <Input
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                placeholder="e.g., javascript, python, go, typescript"
                required
                className="rounded-lg border border-[#3e3e42] bg-[#1e1e1e] text-[#d4d4d4] placeholder:text-[#6a6a6a] focus:border-[#569cd6] focus:ring-1 focus:ring-[#569cd6] h-11 sm:h-12 text-sm sm:text-base transition-all"
              />
              <p className="text-[10px] sm:text-xs text-[#6a6a6a] flex items-center gap-1">
                <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                AI will auto-detect and tag your code based on the language
              </p>
            </div>

            {/* Code Field */}
            <div className="space-y-2 sm:space-y-3">
              <Label htmlFor="code" className="text-sm sm:text-base font-semibold text-[#d4d4d4]">
                Code
              </Label>
              <div className="relative">
                <Textarea
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Paste your code here..."
                  className="font-mono min-h-[300px] sm:min-h-[400px] rounded-lg border border-[#3e3e42] bg-[#1e1e1e] text-[#d4d4d4] placeholder:text-[#6a6a6a] focus:border-[#569cd6] focus:ring-1 focus:ring-[#569cd6] p-3 sm:p-4 text-xs sm:text-sm transition-all resize-y"
                  required
                />
                <div className="absolute top-2 sm:top-3 right-2 sm:right-3 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-[#252526] rounded border border-[#3e3e42] text-[#9d9d9d] text-[10px] sm:text-xs">
                  {code.length} / 10000
                </div>
              </div>
            </div>

            {/* Public Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 sm:p-5 bg-[#1e1e1e] rounded-lg border border-[#3e3e42] hover:border-[#569cd6] transition-all group">
              <div className="flex items-start sm:items-center gap-3">
                <div className="p-1.5 sm:p-2 bg-[#252526] rounded-lg border border-[#3e3e42] group-hover:border-[#569cd6] transition-all flex-shrink-0">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-[#569cd6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <Label htmlFor="public" className="text-[#d4d4d4] font-semibold cursor-pointer text-sm sm:text-base block">
                    Make this snippet public
                  </Label>
                  <p className="text-[10px] sm:text-xs text-[#9d9d9d] mt-0.5 sm:mt-1">Allow others to discover and use your code</p>
                </div>
              </div>
              <Switch
                id="public"
                checked={isPublic}
                onCheckedChange={setIsPublic}
                className="self-end sm:self-auto"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-[#3e3e42]">
              <Button 
                type="submit" 
                disabled={loading} 
                className="rounded-lg bg-[#0e639c] hover:bg-[#1177bb] text-white px-8 sm:px-10 h-11 sm:h-12 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl hover:shadow-[#0e639c]/30 transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span className="hidden sm:inline">Analyzing & Saving...</span>
                    <span className="sm:hidden">Saving...</span>
                  </>
                ) : (
                  <>
                    <UploadIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    Save Snippet
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard")}
                className="rounded-lg border border-[#3e3e42] bg-[#1e1e1e] text-[#9d9d9d] hover:text-[#d4d4d4] hover:bg-[#2d2d30] hover:border-[#569cd6] h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base transition-all"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>

        {/* Info Section */}
        <div className="max-w-4xl mx-auto mt-6 sm:mt-8 p-4 sm:p-6 bg-[#252526] border border-[#3e3e42] rounded-lg">
          <div className="flex items-start gap-2 sm:gap-3">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-[#dcdcaa] mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-[#d4d4d4] font-semibold mb-1 sm:mb-2 text-sm sm:text-base">AI-Powered Analysis</h3>
              <p className="text-[#9d9d9d] text-xs sm:text-sm leading-relaxed">
                Your code will be automatically analyzed by AI to generate tags and a summary. 
                This helps with organization and makes your snippets easier to search and discover.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Upload;
