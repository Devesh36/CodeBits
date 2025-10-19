import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { SnippetCard } from "@/components/SnippetCard";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { Code2 } from "lucide-react";

interface Snippet {
  id: string;
  title: string;
  code: string;
  language: string;
  tags: string[];
  summary: string | null;
  is_public: boolean;
  stars: number;
  created_at: string;
  user_id: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSnippets = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("snippets")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSnippets(data || []);
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
  }, [toast]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      fetchSnippets(session.user.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      fetchSnippets(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, [navigate, fetchSnippets]);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("snippets").delete().eq("id", id);

      if (error) throw error;

      setSnippets(snippets.filter((s) => s.id !== id));
      toast({
        title: "Deleted",
        description: "Snippet deleted successfully",
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#1e1e1e]">
      <Navigation user={user} />
      
      <main className="container mx-auto px-4 py-8 sm:py-12">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3 text-[#d4d4d4]">My Snippets</h1>
            <p className="text-[#9d9d9d] text-base sm:text-lg md:text-xl flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0e639c] text-white font-semibold text-sm">
                {snippets.length}
              </span>
              snippet{snippets.length !== 1 ? "s" : ""} saved
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-24 sm:py-32">
            <div className="inline-block relative">
              <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-[#3e3e42] border-t-[#0e639c]"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Code2 className="h-5 w-5 sm:h-6 sm:w-6 text-[#569cd6]" />
              </div>
            </div>
            <p className="mt-4 sm:mt-6 text-[#9d9d9d] text-base sm:text-lg">Loading your snippets...</p>
          </div>
        ) : snippets.length === 0 ? (
          <div className="text-center py-24 sm:py-32 px-4">
            {/* Empty State */}
            <div className="max-w-md mx-auto">
              <div className="inline-flex p-5 sm:p-6 bg-[#252526] rounded-2xl border border-[#3e3e42] mb-6 sm:mb-8 shadow-xl">
                <Code2 className="h-16 w-16 sm:h-20 sm:w-20 text-[#569cd6]" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#d4d4d4] mb-3 sm:mb-4">No snippets yet</h2>
              <p className="text-[#9d9d9d] mb-6 sm:mb-8 text-base sm:text-lg leading-relaxed px-4">
                Start building your code library by uploading your first snippet. 
                Organize, search, and share your code effortlessly.
              </p>
              <button
                onClick={() => navigate("/upload")}
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-[#0e639c] hover:bg-[#1177bb] text-white rounded-lg font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl hover:shadow-[#0e639c]/30 transform hover:scale-105 transition-all duration-200"
              >
                <Code2 className="h-5 w-5" />
                Upload your first snippet
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {snippets.map((snippet) => (
              <SnippetCard
                key={snippet.id}
                snippet={snippet}
                onDelete={handleDelete}
                isOwner={true}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
