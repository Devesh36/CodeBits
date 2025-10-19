import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Code2, Search, Star, Zap, CheckCircle2, ArrowRight, Github, Sparkles, Users, Lightbulb } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typewriterText, setTypewriterText] = useState("");
  const fullText = '"organize & share"';
  const [visibleCards, setVisibleCards] = useState<boolean[]>(new Array(6).fill(false));
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypewriterText(fullText.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, []);

  useEffect(() => {
    const observers = cardRefs.current.map((card, index) => {
      if (!card) return null;
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                setVisibleCards((prev) => {
                  const newVisible = [...prev];
                  newVisible[index] = true;
                  return newVisible;
                });
              }, index * 150); // Stagger animation by 150ms per card
            }
          });
        },
        { threshold: 0.1 }
      );

      observer.observe(card);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#1e1e1e]">
      <Navigation user={user} />
      
      {/* Hero Section */}
      <main className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto pt-16 pb-20">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            {/* <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#252526] rounded-full border border-[#3e3e42]">
              <Sparkles className="h-4 w-4 text-[#569cd6]" />
              <span className="text-sm font-semibold text-[#569cd6]">Introducing CodeBits Pro</span>
            </div> */}
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-center mb-6 leading-tight text-[#d4d4d4] px-4">
            Code Organization
            <span className="block bg-gradient-to-r from-[#569cd6] via-[#4ec9b0] to-[#c586c0] bg-clip-text text-transparent">
              Meets Collaboration
            </span>
          </h1>

          {/* Animated Illustration */}
          <div className="flex justify-center mb-12">
            <div className="relative w-full max-w-2xl h-64">
              {/* Animated background circles */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute w-64 h-64 bg-[#569cd6] rounded-full mix-blend-screen filter blur-xl opacity-10 animate-float"></div>
                <div className="absolute w-64 h-64 bg-[#4ec9b0] rounded-full mix-blend-screen filter blur-xl opacity-10 animate-float-delayed"></div>
                <div className="absolute w-64 h-64 bg-[#c586c0] rounded-full mix-blend-screen filter blur-xl opacity-10 animate-bounce-soft"></div>
              </div>
              
              {/* Code illustration - VSCode styled */}
              <div className="relative flex items-center justify-center h-full">
                <div className="bg-[#252526] rounded-lg border border-[#3e3e42] p-6 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                  <div className="space-y-2 font-mono text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-[#569cd6]">const</span> <span className="text-[#dcdcaa]">snippet</span>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <span className="text-[#d4d4d4]">=</span> <span className="text-[#ce9178]">{typewriterText}<span className="animate-pulse">|</span></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Subheadline */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#9d9d9d] text-center mb-12 max-w-3xl mx-auto leading-relaxed px-4">
            Save, organize, and share code snippets with your team. AI-powered tagging keeps everything discoverable. Never lose a useful piece of code again.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 px-4">
            <Button 
              size="lg" 
              onClick={() => navigate("/auth")}
              className="rounded-lg bg-[#0e639c] hover:bg-[#1177bb] text-white px-6 sm:px-8 h-12 text-base sm:text-lg font-semibold transform hover:scale-105 transition-transform w-full sm:w-auto"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => navigate("/library")}
              className="rounded-lg border-2 border-[#3e3e42] bg-[#252526] hover:bg-[#2d2d30] text-[#d4d4d4] px-6 sm:px-8 h-12 text-base sm:text-lg font-semibold transform hover:scale-105 transition-transform w-full sm:w-auto"
            >
              <Github className="mr-2 h-5 w-5" />
              Browse Public Library
            </Button>
          </div>

          {/* Search Section */}
          <div className="relative mb-20 px-4">
            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Input
                  placeholder="Search 10K+ code snippets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="text-base sm:text-lg h-12 sm:h-14 rounded-lg border border-[#3e3e42] bg-[#252526] text-[#d4d4d4] placeholder:text-[#6a6a6a] focus:border-[#569cd6] pl-4"
                />
              </div>
              <Button 
                size="lg" 
                onClick={handleSearch} 
                className="h-12 sm:h-14 rounded-lg bg-[#569cd6] hover:bg-[#4a8bbf] px-6 w-full sm:w-auto"
              >
                <Search className="h-5 w-5 sm:mr-2" />
                <span className="sm:inline hidden">Search</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto mb-20 py-12 border-t border-b border-[#3e3e42] px-4">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-[#569cd6] mb-2">10K+</div>
            <p className="text-[#9d9d9d] text-sm sm:text-base">Public Snippets</p>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-[#4ec9b0] mb-2">5K+</div>
            <p className="text-[#9d9d9d] text-sm sm:text-base">Active Users</p>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-[#c586c0] mb-2">99.9%</div>
            <p className="text-[#9d9d9d] text-sm sm:text-base">Uptime Guaranteed</p>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-5xl mx-auto py-20 px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 sm:mb-6 text-[#d4d4d4]">
            Powerful Features for Developers
          </h2>
          <p className="text-lg sm:text-xl text-[#9d9d9d] text-center mb-12 sm:mb-16 max-w-2xl mx-auto px-4">
            Everything you need to organize and share code efficiently
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <div 
              ref={(el) => (cardRefs.current[0] = el)}
              className={`group p-6 sm:p-8 rounded-lg bg-[#252526] border border-[#3e3e42] hover:border-[#569cd6] hover:shadow-xl transition-all duration-500 transform hover:scale-105 ${
                visibleCards[0] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <div className="p-3 bg-[#1e1e1e] rounded-lg w-fit mb-4 sm:mb-6 group-hover:bg-[#2d2d30] transition-all">
                <Sparkles className="h-6 sm:h-8 w-6 sm:w-8 text-[#569cd6]" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 text-[#d4d4d4]">AI-Powered Tagging</h3>
              <p className="text-sm sm:text-base text-[#9d9d9d] leading-relaxed">
                Automatic tags and summaries powered by AI. Your snippets are instantly organized and searchable.
              </p>
            </div>

            {/* Feature 2 */}
            <div 
              ref={(el) => (cardRefs.current[1] = el)}
              className={`group p-6 sm:p-8 rounded-lg bg-[#252526] border border-[#3e3e42] hover:border-[#4ec9b0] hover:shadow-xl transition-all duration-500 transform hover:scale-105 ${
                visibleCards[1] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <div className="p-3 bg-[#1e1e1e] rounded-lg w-fit mb-4 sm:mb-6 group-hover:bg-[#2d2d30] transition-all">
                <Zap className="h-6 sm:h-8 w-6 sm:w-8 text-[#4ec9b0]" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 text-[#d4d4d4]">Lightning Fast Search</h3>
              <p className="text-sm sm:text-base text-[#9d9d9d] leading-relaxed">
                Find exactly what you need in milliseconds. Semantic search understands context and intent.
              </p>
            </div>

            {/* Feature 3 */}
            <div 
              ref={(el) => (cardRefs.current[2] = el)}
              className={`group p-6 sm:p-8 rounded-lg bg-[#252526] border border-[#3e3e42] hover:border-[#c586c0] hover:shadow-xl transition-all duration-500 transform hover:scale-105 ${
                visibleCards[2] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <div className="p-3 bg-[#1e1e1e] rounded-lg w-fit mb-4 sm:mb-6 group-hover:bg-[#2d2d30] transition-all">
                <Users className="h-6 sm:h-8 w-6 sm:w-8 text-[#c586c0]" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 text-[#d4d4d4]">Team Collaboration</h3>
              <p className="text-sm sm:text-base text-[#9d9d9d] leading-relaxed">
                Share snippets with your team, leave comments, and build a shared knowledge base together.
              </p>
            </div>

            {/* Feature 4 */}
            <div 
              ref={(el) => (cardRefs.current[3] = el)}
              className={`group p-6 sm:p-8 rounded-lg bg-[#252526] border border-[#3e3e42] hover:border-[#dcdcaa] hover:shadow-xl transition-all duration-500 transform hover:scale-105 ${
                visibleCards[3] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <div className="p-3 bg-[#1e1e1e] rounded-lg w-fit mb-4 sm:mb-6 group-hover:bg-[#2d2d30] transition-all">
                <Code2 className="h-6 sm:h-8 w-6 sm:w-8 text-[#dcdcaa]" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 text-[#d4d4d4]">Multi-Language Support</h3>
              <p className="text-sm sm:text-base text-[#9d9d9d] leading-relaxed">
                Support for 50+ programming languages with syntax highlighting and formatting.
              </p>
            </div>

            {/* Feature 5 */}
            <div 
              ref={(el) => (cardRefs.current[4] = el)}
              className={`group p-6 sm:p-8 rounded-lg bg-[#252526] border border-[#3e3e42] hover:border-[#4ec9b0] hover:shadow-xl transition-all duration-500 transform hover:scale-105 ${
                visibleCards[4] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <div className="p-3 bg-[#1e1e1e] rounded-lg w-fit mb-4 sm:mb-6 group-hover:bg-[#2d2d30] transition-all">
                <Star className="h-6 sm:h-8 w-6 sm:w-8 text-[#4ec9b0]" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 text-[#d4d4d4]">Public Sharing</h3>
              <p className="text-sm sm:text-base text-[#9d9d9d] leading-relaxed">
                Share your best snippets with the community and get recognized for your contributions.
              </p>
            </div>

            {/* Feature 6 */}
            <div 
              ref={(el) => (cardRefs.current[5] = el)}
              className={`group p-6 sm:p-8 rounded-lg bg-[#252526] border border-[#3e3e42] hover:border-[#ce9178] hover:shadow-xl transition-all duration-500 transform hover:scale-105 ${
                visibleCards[5] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <div className="p-3 bg-[#1e1e1e] rounded-lg w-fit mb-4 sm:mb-6 group-hover:bg-[#2d2d30] transition-all">
                <Lightbulb className="h-6 sm:h-8 w-6 sm:w-8 text-[#ce9178]" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 text-[#d4d4d4]">Smart Insights</h3>
              <p className="text-sm sm:text-base text-[#9d9d9d] leading-relaxed">
                Get insights on popular patterns, trending snippets, and learning opportunities.
              </p>
            </div>
          </div>
        </div>

        {/* Use Cases Section */}
        <div className="max-w-5xl mx-auto py-20 px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 sm:mb-6 text-[#d4d4d4]">
            Built for Every Developer
          </h2>
          <p className="text-lg sm:text-xl text-[#9d9d9d] text-center mb-12 sm:mb-16 max-w-2xl mx-auto px-4">
            From solo developers to enterprise teams
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Use Case 1 */}
            <div className="p-6 sm:p-8 rounded-lg bg-[#252526] border border-[#3e3e42]">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-[#569cd6]">For Individual Developers</h3>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-[#4ec9b0] flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-[#d4d4d4]">Organize your personal code library</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-[#4ec9b0] flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-[#d4d4d4]">Never waste time searching for code</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-[#4ec9b0] flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-[#d4d4d4]">Share your expertise with the community</span>
                </li>
              </ul>
            </div>

            {/* Use Case 2 */}
            <div className="p-6 sm:p-8 rounded-lg bg-[#252526] border border-[#3e3e42]">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-[#c586c0]">For Teams & Organizations</h3>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-[#4ec9b0] flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-[#d4d4d4]">Build a shared knowledge base</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-[#4ec9b0] flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-[#d4d4d4]">Reduce code duplication across projects</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-[#4ec9b0] flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-[#d4d4d4]">Accelerate onboarding new team members</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="max-w-5xl mx-auto py-20 px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 sm:mb-6 text-[#d4d4d4]">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg sm:text-xl text-[#9d9d9d] text-center mb-12 sm:mb-16 max-w-2xl mx-auto px-4">
            Start free, upgrade when you need to
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="p-8 sm:p-10 rounded-lg bg-[#252526] border border-[#3e3e42] flex flex-col hover:border-[#4ec9b0] hover:shadow-2xl hover:shadow-[#4ec9b0]/20 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 min-h-[450px] sm:min-h-[500px]">
              <h3 className="text-xl sm:text-2xl font-bold mb-2 text-[#d4d4d4]">Free</h3>
              <p className="text-[#9d9d9d] mb-6 text-sm sm:text-base">Perfect to get started</p>
              <div className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-[#d4d4d4]">$0<span className="text-base sm:text-lg text-[#9d9d9d]">/mo</span></div>
              <Button 
                onClick={() => navigate("/auth")}
                variant="outline" 
                className="w-full rounded-lg mb-6 sm:mb-8 h-11 sm:h-12 border-2 border-[#3e3e42] bg-transparent text-[#d4d4d4] hover:bg-[#2d2d30] hover:border-[#4ec9b0] transition-all text-sm sm:text-base"
              >
                Get Started
              </Button>
              <ul className="space-y-3 sm:space-y-4 flex-1">
                <li className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-[#4ec9b0] flex-shrink-0" />
                  <span className="text-sm sm:text-base text-[#d4d4d4]">Up to 50 snippets</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-[#4ec9b0] flex-shrink-0" />
                  <span className="text-sm sm:text-base text-[#d4d4d4]">AI-powered tagging</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-[#4ec9b0] flex-shrink-0" />
                  <span className="text-sm sm:text-base text-[#d4d4d4]">Basic search</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-[#4ec9b0] flex-shrink-0" />
                  <span className="text-sm sm:text-base text-[#d4d4d4]">Public snippets</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-[#4ec9b0] flex-shrink-0" />
                  <span className="text-sm sm:text-base text-[#d4d4d4]">Community support</span>
                </li>
              </ul>
            </div>

            {/* Pro Plan - Highlighted */}
            <div className="relative p-8 sm:p-10 rounded-lg bg-gradient-to-br from-[#0e639c] to-[#1177bb] text-white flex flex-col border-2 border-[#0e639c] transform md:scale-105 shadow-xl hover:shadow-2xl hover:shadow-[#0e639c]/30 transition-all duration-300 hover:scale-110 hover:-translate-y-2 min-h-[450px] sm:min-h-[500px]">
              <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2 px-3 sm:px-4 py-1 bg-[#4ec9b0] rounded-full text-xs sm:text-sm font-bold text-[#1e1e1e]">
                MOST POPULAR
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2">Pro</h3>
              <p className="text-white/80 mb-6 text-sm sm:text-base">For serious developers</p>
              <div className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8">$4.99<span className="text-base sm:text-lg">/mo</span></div>
              <Button 
                onClick={() => navigate("/auth")}
                className="w-full rounded-lg mb-6 sm:mb-8 h-11 sm:h-12 bg-white text-[#0e639c] hover:bg-slate-100 hover:scale-105 font-semibold transition-all text-sm sm:text-base"
              >
                Start Free Trial
              </Button>
              <ul className="space-y-3 sm:space-y-4 flex-1">
                <li className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-white flex-shrink-0" />
                  <span className="text-sm sm:text-base">Unlimited snippets</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-white flex-shrink-0" />
                  <span className="text-sm sm:text-base">Advanced search</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-white flex-shrink-0" />
                  <span className="text-sm sm:text-base">Team collaboration</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-white flex-shrink-0" />
                  <span className="text-sm sm:text-base">Priority support</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-white flex-shrink-0" />
                  <span className="text-sm sm:text-base">Advanced analytics</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-white flex-shrink-0" />
                  <span className="text-sm sm:text-base">Custom integrations</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        {/* <div className="max-w-4xl mx-auto py-20 px-8 bg-gradient-to-r from-[#0e639c] via-[#1177bb] to-[#0e639c] rounded-lg text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to organize your code?</h2>
          <p className="text-xl mb-8 text-white/90">Join thousands of developers who save time with CodeBits</p>
          <Button 
            onClick={() => navigate("/auth")}
            className="bg-white text-[#0e639c] hover:bg-slate-100 rounded-lg px-8 h-12 text-lg font-semibold"
          >
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div> */}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#3e3e42] py-12 mt-20 bg-[#252526]">
        <div className="container mx-auto px-4 text-center">
          <p className="text-[#d4d4d4] font-semibold mb-2">
            Smart code organization made easy
          </p>
          <p className="text-sm text-[#9d9d9d]">
            © 2025 CodeBits. All rights reserved. • Built for developers, by developers
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
