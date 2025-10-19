import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Edit, Trash2, Star, Eye, Lock, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SnippetCardProps {
  snippet: {
    id: string;
    title: string;
    code: string;
    language: string;
    tags: string[];
    summary: string | null;
    is_public: boolean;
    stars: number;
    created_at: string;
  };
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onStar?: (id: string) => void;
  isOwner?: boolean;
  hasStarred?: boolean;
}

export const SnippetCard = ({
  snippet,
  onEdit,
  onDelete,
  onStar,
  isOwner,
  hasStarred,
}: SnippetCardProps) => {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.code);
    toast({
      title: "Copied!",
      description: "Code copied to clipboard",
    });
  };

  const handleShare = (platform: string) => {
    const snippetUrl = `${window.location.origin}/snippet/${snippet.id}`;
    const shareText = `Check out this ${snippet.language} code snippet: ${snippet.title}`;
    
    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(snippetUrl)}`,
          "_blank"
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(snippetUrl)}`,
          "_blank"
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(snippetUrl)}`,
          "_blank"
        );
        break;
      case "whatsapp":
        window.open(
          `https://wa.me/?text=${encodeURIComponent(`${shareText} ${snippetUrl}`)}`,
          "_blank"
        );
        break;
      case "copy":
        navigator.clipboard.writeText(snippetUrl);
        toast({
          title: "Link copied!",
          description: "Snippet link copied to clipboard",
        });
        break;
    }
  };

  const codePreview = snippet.code.slice(0, 200);

  return (
    <Card className="p-4 sm:p-6 bg-[#252526] border border-[#3e3e42] hover:border-[#569cd6] hover:shadow-xl hover:shadow-[#569cd6]/10 transition-all duration-300 transform hover:scale-[1.02] group w-full overflow-hidden">
      <div className="flex items-start justify-between mb-3 sm:mb-4 gap-2">
        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-base sm:text-lg md:text-xl text-[#d4d4d4] group-hover:text-[#569cd6] transition-colors truncate flex-1 min-w-0">{snippet.title}</h3>
            {!snippet.is_public && (
              <Lock className="h-3 w-3 sm:h-4 sm:w-4 text-[#9d9d9d] flex-shrink-0" />
            )}
          </div>
          {snippet.summary && (
            <p className="text-xs sm:text-sm text-[#9d9d9d] leading-relaxed line-clamp-2 break-words">{snippet.summary}</p>
          )}
        </div>
        <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
          {onStar && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onStar(snippet.id)}
              className={`${hasStarred ? "text-[#dcdcaa]" : "text-[#9d9d9d]"} hover:text-[#dcdcaa] hover:bg-[#2d2d30] h-7 w-7 sm:h-auto sm:px-2 p-0`}
            >
              <Star className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" fill={hasStarred ? "currentColor" : "none"} />
              <span className="hidden sm:inline">{snippet.stars}</span>
            </Button>
          )}
          {isOwner && onEdit && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEdit(snippet.id)}
              className="text-[#9d9d9d] hover:text-[#569cd6] hover:bg-[#2d2d30] h-7 w-7 sm:h-8 sm:w-8 p-0"
            >
              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          )}
          {isOwner && onDelete && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onDelete(snippet.id)}
              className="text-[#9d9d9d] hover:text-[#f48771] hover:bg-[#2d2d30] h-7 w-7 sm:h-8 sm:w-8 p-0"
            >
              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="mb-3 sm:mb-4 overflow-hidden rounded-md border border-[#3e3e42] group-hover:border-[#569cd6]/30 transition-colors w-full">
        <div className="overflow-x-auto">
          <SyntaxHighlighter
            language={snippet.language}
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              padding: "0.75rem",
              fontSize: "0.75rem",
              maxHeight: "150px",
              background: "#1e1e1e",
              overflowX: "auto",
            }}
            wrapLongLines={true}
          >
            {codePreview}
          </SyntaxHighlighter>
        </div>
        {snippet.code.length > 200 && (
          <p className="text-[10px] sm:text-xs text-[#9d9d9d] mt-1 sm:mt-2 px-2 sm:px-3 flex items-center gap-1 pb-2">
            <Eye className="inline h-2.5 w-2.5 sm:h-3 sm:w-3" /> Click to view full code
          </p>
        )}
      </div>

      <div className="flex items-center justify-between mb-2 sm:mb-3 gap-2 w-full">
        <div className="flex flex-wrap gap-1 sm:gap-2 flex-1 min-w-0 overflow-hidden">
          <Badge className="bg-[#0e639c] hover:bg-[#1177bb] text-white border-0 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 flex-shrink-0">
            {snippet.language}
          </Badge>
          {snippet.tags.slice(0, 2).map((tag, i) => (
            <Badge 
              key={i} 
              className="bg-[#1e1e1e] border border-[#3e3e42] text-[#9d9d9d] hover:border-[#569cd6] hover:text-[#569cd6] text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 flex-shrink-0 max-w-[120px] truncate"
            >
              {tag}
            </Badge>
          ))}
          {snippet.tags.length > 2 && (
            <Badge className="bg-[#1e1e1e] border border-[#3e3e42] text-[#9d9d9d] text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 flex-shrink-0">
              +{snippet.tags.length - 2}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleCopy}
            className="text-[#9d9d9d] hover:text-[#4ec9b0] hover:bg-[#2d2d30] h-7 w-7 sm:h-8 sm:w-8 p-0"
          >
            <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-[#9d9d9d] hover:text-[#569cd6] hover:bg-[#2d2d30] h-7 w-7 sm:h-8 sm:w-8 p-0"
              >
                <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-44 sm:w-48 bg-[#252526] border border-[#3e3e42] text-[#d4d4d4]"
            >
              <DropdownMenuItem 
                onClick={() => handleShare("twitter")}
                className="cursor-pointer hover:bg-[#2d2d30] focus:bg-[#2d2d30] focus:text-[#569cd6] text-xs sm:text-sm"
              >
                <svg className="h-3 w-3 sm:h-4 sm:w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Share on X (Twitter)
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleShare("linkedin")}
                className="cursor-pointer hover:bg-[#2d2d30] focus:bg-[#2d2d30] focus:text-[#569cd6] text-xs sm:text-sm"
              >
                <svg className="h-3 w-3 sm:h-4 sm:w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                Share on LinkedIn
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleShare("facebook")}
                className="cursor-pointer hover:bg-[#2d2d30] focus:bg-[#2d2d30] focus:text-[#569cd6] text-xs sm:text-sm"
              >
                <svg className="h-3 w-3 sm:h-4 sm:w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Share on Facebook
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleShare("whatsapp")}
                className="cursor-pointer hover:bg-[#2d2d30] focus:bg-[#2d2d30] focus:text-[#569cd6] text-xs sm:text-sm"
              >
                <svg className="h-3 w-3 sm:h-4 sm:w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Share on WhatsApp
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleShare("copy")}
                className="cursor-pointer hover:bg-[#2d2d30] focus:bg-[#2d2d30] focus:text-[#569cd6] text-xs sm:text-sm"
              >
                <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Copy Link
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <p className="text-[10px] sm:text-xs text-[#6a6a6a] flex items-center gap-1 sm:gap-2 truncate">
        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#4ec9b0] flex-shrink-0"></span>
        <span className="truncate">{new Date(snippet.created_at).toLocaleDateString()}</span>
      </p>
    </Card>
  );
};
