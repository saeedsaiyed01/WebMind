import {
  Brain,
  Database,
  FileText,
  Github,
  MessageSquare,
  Twitter
} from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();

  // Redirect logged in users to dashboard
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  // Open social links
  const handleTwitter = () => {
    window.open("https://x.com/saeedsaiyedtwt");
  };

  const handleGithub = () => {
    window.open("https://github.com/saeedsaiyed01/WebMind");
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white relative overflow-hidden">
      {/* Background gradient and image */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#FF4500]/20 via-transparent to-transparent animate-pulse pointer-events-none" />

      {/* ✅ Background image via inline style to fix remote URL issue */}
      <div
        className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1639322537228-f710d846310a')"
        }}
      />

      {/* Main Content */}
      <div className="relative">
        {/* Navigation */}
        <nav className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-[#FF4500]" />
            <span className="text-xl font-bold">WebMind</span>
          </div>
          <div className="flex items-center space-x-6">
            <button
              onClick={() => navigate("/signin")}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-4 py-2 rounded-lg bg-[#FF4500] hover:bg-[#FF4500]/90 transition-all font-semibold"
            >
              Sign Up
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="container mx-auto px-4 sm:px-6 pt-16 pb-20 md:pt-20 md:pb-32">
          <div className="max-w-4xl mx-auto text-center">
          <div
  className="inline-block px-4 py-2 mb-0 rounded-full text-sm font-medium text-white bg-gradient-to-r from-[#FF4500] to-[#FF7F50] shadow-lg shadow-[#FF4500]/50 hover:scale-105 transition-transform"
>
  AI-Powered Insights
</div>
          <h1
   className="text-3xl sm:text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-white to-[#FF4500] bg-clip-text text-transparent"
   style={{ WebkitBackgroundClip: 'text', lineHeight: '1.6' /* or even '1.7', '1.8', '2' */ }} // Added explicit line-height
 >
   A Digital Workspace for Your
   <br />
   Digital Life
 </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-12 leading-relaxed">
              WebMind stores your tweets, notes, and documents so you can build and query your own personal knowledge base. Ask questions and discover insights from your content.
            </p>
            <button
              onClick={() => navigate("/signup")}
              className="px-6 py-3 rounded-lg bg-[#FF4500] hover:bg-[#FF4500]/90 transition-all transform hover:scale-105 font-semibold text-base sm:text-lg shadow-lg shadow-[#FF4500]/20 animate-glow"
            >
              Get Started Free
            </button>
          </div>

          {/* How It Works Section */}
          <div id="how-it-works" className="max-w-5xl mx-auto mt-24 md:mt-32 px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="bg-gradient-to-r from-white to-[#FF4500] bg-clip-text text-transparent">
                How It Works
              </span>
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm flex flex-col items-center text-center h-full">
                <div className="h-16 w-16 rounded-xl bg-[#FF4500]/20 flex items-center justify-center mb-6">
                  <FileText className="h-8 w-8 text-[#FF4500]" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Add Your Content</h3>
                <p className="text-gray-400">
                  Import tweets, notes, and documents easily to build your digital repository.
                </p>
              </div>

              <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm flex flex-col items-center text-center h-full">
                <div className="h-16 w-16 rounded-xl bg-[#FF4500]/20 flex items-center justify-center mb-6">
                  <MessageSquare className="h-8 w-8 text-[#FF4500]" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Ask Questions</h3>
                <p className="text-gray-400">
                  Query your content using natural language and let our AI uncover valuable insights.
                </p>
              </div>

              <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm flex flex-col items-center text-center h-full">
                <div className="h-16 w-16 rounded-xl bg-[#FF4500]/20 flex items-center justify-center mb-6">
                  <Database className="h-8 w-8 text-[#FF4500]" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Get Knowledge-Based Answers</h3>
                <p className="text-gray-400">
                  Your content is organized and analyzed, so you can retrieve precise, knowledge-based answers.
                </p>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div id="features" className="max-w-6xl mx-auto mt-24 md:mt-32 px-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {["AI-Powered Insights", "Smart Organization", "Seamless Integration"].map((title, i) => (
                <div key={i} className="p-6 rounded-xl bg-white/5 backdrop-blur-sm h-full">
                  <div className="h-12 w-12 rounded-lg bg-[#FF4500]/20 flex items-center justify-center mb-4">
                    <Brain className="h-6 w-6 text-[#FF4500]" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{title}</h3>
                  <p className="text-gray-400">
                    {title === "AI-Powered Insights" && "Harness the power of AI to turn your unstructured data into organized, actionable insights."}
                    {title === "Smart Organization" && "Automatically categorize and tag your content so your knowledge base is always organized."}
                    {title === "Seamless Integration" && "Connect effortlessly with your favorite platforms to bring all your knowledge together."}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 mt-16">
          <div className="container mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-500">
              © 2025 WebMind. All rights reserved.
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleTwitter}
                className="text-gray-400 hover:text-[#FF4500] transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </button>
              <button
                onClick={handleGithub}
                className="text-gray-400 hover:text-[#FF4500] transition-colors"
              >
                <Github className="h-5 w-5" />
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default LandingPage;
