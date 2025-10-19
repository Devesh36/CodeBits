import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Code2 } from "lucide-react";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().optional(),
});

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
    });
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validation = authSchema.safeParse({
        email,
        password,
        fullName: isLogin ? undefined : fullName,
      });

      if (!validation.success) {
        toast({
          title: "Validation Error",
          description: validation.error.errors[0].message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
        navigate("/dashboard");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });

        if (error) throw error;

        toast({
          title: "Account created!",
          description: "Welcome to CodeBits. Start saving your snippets!",
        });
        navigate("/dashboard");
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
  };

  return (
    <div className="min-h-screen bg-[#1e1e1e] flex items-center justify-center p-4">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-[#0e639c] rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-float top-1/4 left-1/4"></div>
        <div className="absolute w-96 h-96 bg-[#569cd6] rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-float-delayed bottom-1/4 right-1/4"></div>
      </div>

      <Card className="w-full max-w-md p-10 rounded-lg border border-[#3e3e42] bg-[#252526] shadow-2xl relative z-10 transform hover:scale-[1.01] transition-transform duration-300">
        {/* Logo/Icon */}
        <div className="flex justify-center mb-8">
          <div className="p-4 bg-[#1e1e1e] rounded-lg border border-[#3e3e42] shadow-lg">
            <Code2 className="h-12 w-12 text-[#569cd6]" />
          </div>
        </div>

        {/* Header */}
        <h1 className="text-4xl font-bold text-center mb-3 text-[#d4d4d4]">
          {isLogin ? "Welcome back" : "Create an account"}
        </h1>
        <p className="text-center text-[#9d9d9d] mb-10 text-lg">
          {isLogin
            ? "Sign in to access your snippets"
            : "Join CodeBits and start saving code"}
        </p>

        {/* Form */}
        <form onSubmit={handleAuth} className="space-y-6">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#d4d4d4]">Full Name</label>
              <Input
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required={!isLogin}
                className="rounded-lg border border-[#3e3e42] bg-[#1e1e1e] text-[#d4d4d4] placeholder:text-[#6a6a6a] focus:border-[#569cd6] focus:ring-1 focus:ring-[#569cd6] h-12 text-base transition-all"
              />
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#d4d4d4]">Email</label>
            <Input
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-lg border border-[#3e3e42] bg-[#1e1e1e] text-[#d4d4d4] placeholder:text-[#6a6a6a] focus:border-[#569cd6] focus:ring-1 focus:ring-[#569cd6] h-12 text-base transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#d4d4d4]">Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded-lg border border-[#3e3e42] bg-[#1e1e1e] text-[#d4d4d4] placeholder:text-[#6a6a6a] focus:border-[#569cd6] focus:ring-1 focus:ring-[#569cd6] h-12 text-base transition-all"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full rounded-lg bg-[#0e639c] hover:bg-[#1177bb] text-white h-12 text-lg font-semibold shadow-lg hover:shadow-xl hover:shadow-[#0e639c]/30 transform hover:scale-[1.02] transition-all duration-200" 
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-pulse">Processing...</span>
              </span>
            ) : (
              isLogin ? "Sign In" : "Sign Up"
            )}
          </Button>
        </form>

        {/* Toggle Sign In/Sign Up */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-[#569cd6] hover:text-[#4a8bbf] font-medium transition-colors underline-offset-4 hover:underline"
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center border-t border-[#3e3e42] pt-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")} 
            className="text-[#9d9d9d] hover:text-[#d4d4d4] hover:bg-[#2d2d30] transition-colors"
          >
            Back to Home
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
