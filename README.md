# 🚀 CodeBits - Smart Code Snippet Manager

> **Organize, Share, and Discover Code Snippets with AI-Powered Intelligence**

[![Built with React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Powered by Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?logo=supabase)](https://supabase.com/)
[![AI Powered](https://img.shields.io/badge/AI-Google%20Gemini-4285F4?logo=google)](https://ai.google.dev/)

CodeBits is a modern, feature-rich code snippet management platform designed for developers who want to **organize their code library**, **collaborate with teams**, and **discover useful snippets** from the community.

---

## ✨ Key Features

### 🤖 **AI-Powered Intelligence**
- **Automatic Tagging**: AI analyzes your code and generates relevant tags
- **Smart Summaries**: Get instant descriptions of what your code does
- **Language Detection**: Automatically identifies programming languages

### 🎨 **Beautiful VSCode-Inspired Design**
- **Dark Theme**: Professional VSCode color scheme throughout
- **Syntax Highlighting**: 50+ languages with proper code formatting
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile

### 📱 **Fully Mobile Responsive**
- Optimized layouts for all screen sizes (320px - 4K)
- Touch-friendly interfaces
- Mobile-first design approach
- Adaptive navigation with hamburger menu

### 🔍 **Powerful Search**
- **Full-Text Search**: Search by title, language, tags, or content
- **Instant Results**: Lightning-fast search with real-time filtering
- **Smart Fallback**: Shows all snippets when no results found

### 🌐 **Social Sharing**
- Share snippets on Twitter/X, LinkedIn, Facebook, and WhatsApp
- Copy direct links to clipboard
- Public snippet library for community discovery

### 📊 **Personal Dashboard**
- Manage your private snippet collection
- Track your saved snippets count
- Easy edit and delete functionality

### 📤 **Smart Upload System**
- Multi-language support
- Character counter (10,000 character limit)
- Public/Private visibility toggle
- AI-powered analysis during upload

### 🔐 **Secure Authentication**
- Email/Password authentication via Supabase
- Protected routes and user sessions
- Profile management

---

## 🛠️ Tech Stack

### **Frontend**
- **React 18.3.1** - Modern UI library
- **TypeScript 5.5.3** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful component library

### **Backend & Services**
- **Supabase** - PostgreSQL database, authentication, and storage
- **Google Gemini AI** - Code analysis and tagging
- **Supabase Edge Functions** - Serverless API endpoints

### **Key Libraries**
- **React Router v6** - Client-side routing with lazy loading
- **React Query (TanStack Query)** - Data fetching and caching
- **React Syntax Highlighter** - Code syntax highlighting with VSCode theme
- **Lucide React** - Modern icon library
- **Zod** - Schema validation

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **Bun** or **npm** package manager
- **Supabase Account** - [Sign up here](https://supabase.com/)
- **Google Gemini API Key** - [Get your key](https://ai.google.dev/)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Devesh36/CodeBits.git
cd CodeBits
```

2. **Install dependencies**
```bash
# Using bun (recommended)
bun install

# Or using npm
npm install
```

3. **Set up environment variables**
Create a `.env.local` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Set up Supabase**
- Create a new Supabase project
- Run the migrations in `supabase/migrations/`
- Deploy the Edge Functions in `supabase/functions/`
- Add your Google Gemini API key to Supabase secrets

5. **Start the development server**
```bash
# Using bun
bun run dev

# Or using npm
npm run dev
```

6. **Open your browser**
Navigate to `http://localhost:5173`

---

## 📁 Project Structure

```
codebitss/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navigation.tsx   # Main navigation bar
│   │   ├── SnippetCard.tsx  # Snippet display card
│   │   └── ui/              # shadcn/ui components
│   ├── pages/               # Application pages
│   │   ├── Index.tsx        # Landing page
│   │   ├── Auth.tsx         # Sign in/Sign up
│   │   ├── Dashboard.tsx    # User's snippets
│   │   ├── Upload.tsx       # Create new snippet
│   │   ├── Search.tsx       # Search snippets
│   │   ├── Library.tsx      # Browse public snippets
│   │   └── Profile.tsx      # User profile
│   ├── integrations/        # External service integrations
│   │   └── supabase/        # Supabase client & types
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions
│   └── App.tsx             # Main application component
├── supabase/
│   ├── functions/           # Edge Functions
│   │   └── analyze-snippet/ # AI code analysis
│   └── migrations/          # Database migrations
└── public/                  # Static assets
```

---

## 🎨 Design System

### Color Palette (VSCode Theme)
- **Background**: `#1e1e1e`
- **Card Background**: `#252526`
- **Borders**: `#3e3e42`
- **Primary Blue**: `#0e639c`
- **Accent Blue**: `#569cd6`
- **Text Primary**: `#d4d4d4`
- **Text Muted**: `#9d9d9d`
- **Success Green**: `#4ec9b0`
- **Warning Yellow**: `#dcdcaa`
- **Error Red**: `#f48771`

### Typography
- **Headings**: System font stack (San Francisco, Segoe UI, etc.)
- **Code**: Monaco (VSCode's default monospace font)

### Responsive Breakpoints
- **Mobile**: `< 640px`
- **Tablet**: `640px - 1024px`
- **Desktop**: `> 1024px`

---

## 🔥 Key Features Breakdown

### 1. **AI Code Analysis**
When you upload a snippet:
1. Code is sent to Google Gemini API
2. AI analyzes the code and extracts:
   - Programming language
   - Relevant tags (frameworks, concepts, patterns)
   - Brief summary of functionality
3. Results are automatically saved with the snippet

### 2. **Smart Search**
- **Real-time filtering** as you type
- Searches across: title, language, tags, and summary
- **Fallback display**: Shows all public snippets when no results
- **URL parameter support**: Shareable search links

### 3. **Social Sharing**
Share buttons with platform-specific formatting:
- **Twitter/X**: Optimized for 280-character limit
- **LinkedIn**: Professional network sharing
- **Facebook**: Social media sharing
- **WhatsApp**: Direct messaging with link
- **Copy Link**: Instant clipboard copy

### 4. **User Dashboard**
- View all your snippets in one place
- Quick actions: Edit, Delete, Copy, Share
- Real-time snippet count
- Beautiful empty states for new users

---

## 🔧 Configuration Files

- **`vite.config.ts`** - Vite build configuration
- **`tailwind.config.ts`** - Tailwind CSS customization
- **`tsconfig.json`** - TypeScript compiler options
- **`components.json`** - shadcn/ui configuration
- **`.eslintrc.json`** - Code linting rules

---

## 📊 Database Schema

### **snippets** table
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key)
- title (text)
- code (text)
- language (text)
- tags (text[])
- summary (text)
- is_public (boolean)
- stars (integer)
- created_at (timestamp)
```

### **snippet_stars** table
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key)
- snippet_id (uuid, foreign key)
- created_at (timestamp)
```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy**
```bash
vercel
```

### Deploy to Netlify

1. **Install Netlify CLI**
```bash
npm i -g netlify-cli
```

2. **Deploy**
```bash
netlify deploy --prod
```

### Environment Variables
Make sure to set these in your deployment platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **shadcn/ui** - Beautiful component library
- **Supabase** - Amazing backend infrastructure
- **Google Gemini** - Powerful AI capabilities
- **Lucide** - Clean and consistent icons
- **React Syntax Highlighter** - Code highlighting
- **Tailwind CSS** - Utility-first CSS framework

---

## 📧 Contact & Support

- **Developer**: Devesh Rathod
- **GitHub**: [@Devesh36](https://github.com/Devesh36)
- **Repository**: [CodeBits](https://github.com/Devesh36/CodeBits)

---

## 🎯 Roadmap

- [ ] **Community Features** - Comments, discussions, and reactions
- [ ] **Collections** - Organize snippets into collections
- [ ] **Teams** - Collaborate with team members
- [ ] **Code Playground** - Test snippets directly in the browser
- [ ] **VS Code Extension** - Sync snippets with VS Code
- [ ] **API Access** - RESTful API for integrations
- [ ] **Advanced Analytics** - Usage statistics and insights
- [ ] **Markdown Support** - Documentation alongside code
- [ ] **Version History** - Track snippet changes over time
- [ ] **Export/Import** - Backup and restore snippets

---

<div align="center">

**Made with ❤️ by developers, for developers**

⭐ Star this repo if you find it useful!

</div>
