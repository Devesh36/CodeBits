import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { SnippetCard } from "@/components/SnippetCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";
import { User } from "@supabase/supabase-js";

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

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [allSnippets, setAllSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(false);

  // Helper function to get animation delay class
  const getDelayClass = (index: number) => {
    const delay = Math.min(index * 50, 800);
    return `animate-delay-${delay}`;
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    
    // Fetch all public snippets on mount
    fetchAllSnippets();
  }, []);

  useEffect(() => {
    if (query) {
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAllSnippets = async () => {
    try {
      const { data, error } = await supabase
        .from("snippets")
        .select("*")
        .eq("is_public", true)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setAllSnippets(data || []);
    } catch (error) {
      console.error("Error fetching snippets:", error);
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("snippets")
        .select("*")
        .or(`title.ilike.%${query}%,language.ilike.%${query}%,summary.ilike.%${query}%`)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setSnippets(data || []);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: query });
    handleSearch();
  };

  return (
    <div className="min-h-screen bg-[#1e1e1e]">
      <Navigation user={user} />
      
  <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-10 max-w-7xl">
        {/* Search Bar */}
        <div className="mb-8 sm:mb-12">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-3 sm:left-5 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <SearchIcon className="h-5 w-5 sm:h-6 sm:w-6 text-[#569cd6]" />
              </div>
              <Input
                placeholder="Search snippets..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-12 sm:pl-16 pr-24 sm:pr-32 h-12 sm:h-16 rounded-lg border-2 border-[#3e3e42] bg-[#252526] text-[#d4d4d4] placeholder:text-[#6a6a6a] focus:border-[#569cd6] focus:ring-2 focus:ring-[#569cd6]/30 text-sm sm:text-lg shadow-lg transition-all"
              />
              <Button 
                type="submit"
                className="absolute right-2 sm:right-2 top-1/2 transform -translate-y-1/2 h-10 sm:h-12 px-3 sm:px-6 rounded-lg bg-[#0e639c] hover:bg-[#1177bb] text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-[#0e639c]/30 transition-all flex items-center"
              >
                <SearchIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                <span className="hidden sm:inline">Search</span>
              </Button>
            </div>
          </form>
        </div>

        {/* Results Section */}
        {loading ? (
          <div className="text-center py-16 sm:py-24">
            <div className="inline-block relative mb-6 sm:mb-8">
              <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-[#3e3e42] border-t-[#569cd6] shadow-lg"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <SearchIcon className="h-6 w-6 sm:h-8 sm:w-8 text-[#569cd6]" />
              </div>
            </div>
            <p className="text-[#9d9d9d] text-lg sm:text-xl font-medium">Searching...</p>
          </div>
        ) : query && snippets.length === 0 ? (
          <>
            {/* No results found - show message */}
            <div className="text-center py-12 mb-12">
              <div className="inline-flex p-6 bg-[#252526] rounded-xl border border-[#3e3e42] mb-4">
                <SearchIcon className="h-12 w-12 text-[#9d9d9d]" />
              </div>
              <h2 className="text-2xl font-bold text-[#d4d4d4] mb-2">
                No results found for "{query}"
              </h2>
              <p className="text-[#9d9d9d] mb-8">
                Try different keywords or browse all available snippets below
              </p>
            </div>

            {/* Show all available snippets */}
            {allSnippets.length > 0 && (
              <>
                <div className="mb-8 pb-6 border-b-2 border-[#3e3e42]">
                  <p className="text-[#9d9d9d] text-lg">
                    Showing <span className="text-[#d4d4d4] font-semibold">{allSnippets.length}</span> available snippet{allSnippets.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {allSnippets.map((snippet, index) => (
                    <div
                      key={snippet.id}
                      className={`animate-fade-in ${getDelayClass(index)}`}
                    >
                      <SnippetCard
                        snippet={snippet}
                        isOwner={user?.id === snippet.user_id}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        ) : snippets.length > 0 ? (
          <>
            {/* Results Header */}
            <div className="mb-8 pb-6 border-b-2 border-[#3e3e42]">
              <p className="text-[#9d9d9d] text-lg">
                Found <span className="text-[#d4d4d4] font-semibold">{snippets.length}</span> snippet{snippets.length !== 1 ? "s" : ""} for <span className="text-[#569cd6]">"{query}"</span>
              </p>
            </div>

            {/* Snippets Grid */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {snippets.map((snippet, index) => (
                <div
                  key={snippet.id}
                  className={`animate-fade-in ${getDelayClass(index)}`}
                >
                  <SnippetCard
                    snippet={snippet}
                    isOwner={user?.id === snippet.user_id}
                  />
                </div>
              ))}
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
};

export default Search;
