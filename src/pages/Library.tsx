import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { SnippetCard } from "@/components/SnippetCard";
import { User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Code2, Star, TrendingUp, Users, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

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

const Library = () => {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [filteredSnippets, setFilteredSnippets] = useState<Snippet[]>([]);
  const [starredSnippets, setStarredSnippets] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPublicSnippets = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("snippets")
        .select("*")
        .eq("is_public", true)
        .order("stars", { ascending: false })
        .limit(50);

      if (error) throw error;
      setSnippets(data || []);
      setFilteredSnippets(data || []);

      if (user) {
        const { data: stars } = await supabase
          .from("snippet_stars")
          .select("snippet_id")
          .eq("user_id", user.id);
        
        if (stars) {
          setStarredSnippets(new Set(stars.map((s) => s.snippet_id)));
        }
      }
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
  }, [user, toast]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    fetchPublicSnippets();
  }, [fetchPublicSnippets]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSnippets(snippets);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = snippets.filter(
        (snippet) =>
          snippet.title.toLowerCase().includes(query) ||
          snippet.language.toLowerCase().includes(query) ||
          snippet.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          (snippet.summary && snippet.summary.toLowerCase().includes(query))
      );
      setFilteredSnippets(filtered);
    }
  }, [searchQuery, snippets]);

  const handleStar = async (snippetId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to star snippets",
        variant: "destructive",
      });
      return;
    }

    try {
      const isStarred = starredSnippets.has(snippetId);

      if (isStarred) {
        await supabase
          .from("snippet_stars")
          .delete()
          .eq("snippet_id", snippetId)
          .eq("user_id", user.id);
        
        setStarredSnippets((prev) => {
          const next = new Set(prev);
          next.delete(snippetId);
          return next;
        });
      } else {
        await supabase
          .from("snippet_stars")
          .insert({ snippet_id: snippetId, user_id: user.id });
        
        setStarredSnippets((prev) => new Set(prev).add(snippetId));
      }

      fetchPublicSnippets();
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
      
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12">
        {/* Header Section */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="p-3 sm:p-4 bg-[#252526] rounded-lg border border-[#3e3e42] shadow-lg flex-shrink-0">
              <BookOpen className="h-7 w-7 sm:h-9 sm:w-9 md:h-10 md:w-10 text-[#569cd6]" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#d4d4d4] mb-1 sm:mb-2">Public Library</h1>
              <p className="text-[#9d9d9d] text-sm sm:text-base md:text-lg lg:text-xl">
                Discover, star, and learn from community code snippets
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="p-4 sm:p-5 md:p-6 bg-[#252526] border border-[#3e3e42] rounded-lg hover:border-[#569cd6] transition-all group">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <Code2 className="h-5 w-5 sm:h-6 sm:w-6 text-[#569cd6] group-hover:scale-110 transition-transform" />
                <h3 className="text-[#9d9d9d] text-xs sm:text-sm font-semibold uppercase tracking-wide">Total Snippets</h3>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-[#d4d4d4]">{snippets.length}</p>
            </div>

            <div className="p-4 sm:p-5 md:p-6 bg-[#252526] border border-[#3e3e42] rounded-lg hover:border-[#4ec9b0] transition-all group">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-[#4ec9b0] group-hover:scale-110 transition-transform" />
                <h3 className="text-[#9d9d9d] text-xs sm:text-sm font-semibold uppercase tracking-wide">Most Starred</h3>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-[#d4d4d4]">
                {snippets.length > 0 ? snippets[0]?.stars || 0 : 0}
              </p>
            </div>

            <div className="p-4 sm:p-5 md:p-6 bg-[#252526] border border-[#3e3e42] rounded-lg hover:border-[#c586c0] transition-all group">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-[#c586c0] group-hover:scale-110 transition-transform" />
                <h3 className="text-[#9d9d9d] text-xs sm:text-sm font-semibold uppercase tracking-wide">Languages</h3>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-[#d4d4d4]">
                {new Set(snippets.map((s) => s.language)).size}
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-3xl">
            <div className="absolute left-3 sm:left-5 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <Search className="h-4 w-4 sm:h-5 sm:w-5 text-[#569cd6]" />
            </div>
            <Input
              type="text"
              placeholder="Search snippets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 sm:pl-14 pr-10 sm:pr-14 h-12 sm:h-14 md:h-16 rounded-lg border-2 border-[#3e3e42] bg-[#252526] text-[#d4d4d4] placeholder:text-[#6a6a6a] focus:border-[#569cd6] focus:ring-2 focus:ring-[#569cd6]/30 text-sm sm:text-base shadow-lg transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 sm:right-5 top-1/2 transform -translate-y-1/2 text-[#9d9d9d] hover:text-[#f48771] transition-colors p-1 hover:bg-[#2d2d30] rounded"
                aria-label="Clear search"
                title="Clear search"
              >
                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            {searchQuery && (
              <div className="absolute -bottom-6 sm:-bottom-8 left-0 text-xs sm:text-sm text-[#9d9d9d]">
                Found {filteredSnippets.length} result{filteredSnippets.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="text-center py-16 sm:py-24 md:py-32">
            <div className="inline-block relative">
              <div className="animate-spin rounded-full h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 border-4 border-[#3e3e42] border-t-[#569cd6]"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-[#569cd6]" />
              </div>
            </div>
            <p className="mt-4 sm:mt-6 text-[#9d9d9d] text-base sm:text-lg">Loading public library...</p>
          </div>
        ) : filteredSnippets.length === 0 ? (
          <div className="text-center py-16 sm:py-24 md:py-32 px-4">
            <div className="max-w-md mx-auto">
              <div className="inline-flex p-4 sm:p-5 md:p-6 bg-[#252526] rounded-2xl border border-[#3e3e42] mb-6 sm:mb-8 shadow-xl">
                {searchQuery ? (
                  <Search className="h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 text-[#9d9d9d]" />
                ) : (
                  <BookOpen className="h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 text-[#569cd6]" />
                )}
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#d4d4d4] mb-3 sm:mb-4">
                {searchQuery ? "No results found" : "No public snippets yet"}
              </h2>
              <p className="text-[#9d9d9d] text-sm sm:text-base md:text-lg leading-relaxed">
                {searchQuery
                  ? `No snippets match "${searchQuery}". Try a different search term.`
                  : "Be the first to share your code with the community!"}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-4 sm:mt-6 px-4 sm:px-6 py-2 sm:py-3 bg-[#0e639c] hover:bg-[#1177bb] text-white text-sm sm:text-base rounded-lg font-semibold transition-all transform hover:scale-105"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 text-[#dcdcaa] flex-shrink-0" />
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#d4d4d4]">
                  {searchQuery ? `Search Results (${filteredSnippets.length})` : "Top Starred Snippets"}
                </h2>
              </div>
              {user && (
                <p className="text-[#9d9d9d] text-xs sm:text-sm">
                  You've starred {starredSnippets.size} snippet{starredSnippets.size !== 1 ? "s" : ""}
                </p>
              )}
            </div>

            {/* Snippets Grid */}
            <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredSnippets.map((snippet) => (
                <SnippetCard
                  key={snippet.id}
                  snippet={snippet}
                  onStar={handleStar}
                  isOwner={user?.id === snippet.user_id}
                  hasStarred={starredSnippets.has(snippet.id)}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Library;
