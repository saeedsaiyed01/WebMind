import { motion } from "framer-motion";
import { CheckCircle, FolderPlus, GalleryVerticalEnd, MessageSquare, Sparkles, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import { LampContainer } from "../components/ui/lamp.tsx";
import NewNavbar from "../components/ui/NewNavbar.tsx";

const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "WebMind",
  "url": "https://webmind.buzz",
  "description": "Store tweets, notes, PDFs, and more into an AI-searchable personal knowledge base.",
  "applicationCategory": "ProductivityApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full overflow-x-hidden bg-black dark scroll-smooth">
      <SEO
        title="WebMind — All Your Digital Memory Unleashed"
        description="Store tweets, notes, PDFs, and more into an AI-searchable personal knowledge base. Recall anything instantly with AI."
        url="https://webmind.buzz"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
      />
      <NewNavbar variant="landing" />
      <LampContainer>
        <div className="flex flex-col items-center px-4">
          <motion.h1
            initial={{ opacity: 0.5, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-0 md:mt-[-70px] bg-gradient-to-br from-white via-zinc-200 to-zinc-500 py-4 bg-clip-text text-center text-4xl sm:text-5xl font-bold font-mono tracking-tight text-transparent md:text-7xl leading-[1.1]"
          >
            All Your Digital <br /> Memory Unleashed
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5, ease: "easeOut" }}
            className="mt-6 sm:mt-8 text-center text-zinc-400 max-w-xl mx-auto text-base sm:text-lg md:text-xl font-normal leading-relaxed tracking-tight"
          >
            WebMind stores every tweet, note, and document—transforming your content into a powerful, queryable personal knowledge base.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5, ease: "easeOut" }}
            className="mt-10 sm:mt-12 flex gap-4 sm:gap-5 items-center flex-col sm:flex-row"
          >
            <button
              onClick={() => (localStorage.getItem("token") ? navigate("/dashboard") : navigate("/signup"))}
              className="cursor-pointer select-none inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium h-12 px-8 bg-primary text-primary-foreground shadow-[0_0_24px_rgba(255,255,255,0.15)] hover:shadow-[0_0_32px_rgba(255,255,255,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              {localStorage.getItem("token") ? "Go to Dashboard" : "Try Now"}
            </button>
            <button
              onClick={() => navigate("/about")}
              className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-zinc-900/80 border border-zinc-700/80 text-zinc-200 font-medium hover:bg-zinc-800 hover:border-zinc-600 hover:text-white active:scale-[0.98] transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Learn More
            </button>
          </motion.div>

          {/* Dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, y: 80, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.45, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-14 sm:mt-16 md:mt-24 w-full max-w-5xl mx-auto relative z-20 px-1"
          >
            <div className="absolute -inset-2 bg-gradient-to-r from-zinc-700/40 via-zinc-600/30 to-zinc-700/40 rounded-2xl blur-xl opacity-40" />
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-zinc-800/80 ring-1 ring-white/5">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none z-10" />
              <img
                src="/newheropage.png"
                alt="WebMind Dashboard Preview"
                className="w-full h-auto object-cover"
                loading="eager"
                // @ts-ignore
                fetchPriority="high"
              />
            </div>
          </motion.div>
        </div>
      </LampContainer>

      {/* Features Section */}
      <section id="features" className="py-24 md:py-32 relative z-20 bg-black overflow-hidden scroll-mt-20">
         <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
         <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[min(90vw,700px)] h-48 pointer-events-none">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-600/40 to-transparent" style={{ borderRadius: "0 0 50% 50% / 0 0 100% 100%" }} />
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-80 h-24 bg-zinc-600/10 blur-3xl rounded-full" />
         </div>

         <div className="container mx-auto px-6 relative z-10 pt-14 md:pt-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto"
            >
               <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900/70 mb-6 backdrop-blur-sm shadow-lg shadow-black/20">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400/90" />
                  <span className="text-zinc-300 text-xs font-medium tracking-wide uppercase">Why Choose Our Chatbot</span>
               </div>
               <h2 className="text-4xl sm:text-5xl lg:text-6xl font-mono font-bold text-white mb-5 tracking-tight leading-[1.15]">
                  Revolutionize Communication Now
               </h2>
               <p className="text-zinc-500 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
                  Transform your communication and streamline your workflow with AI-driven automation that enhances productivity and delivers seamless interactions.
               </p>
            </motion.div>

            {/* Feature Cards - Responsive grid, larger and more balanced */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 mt-12 md:mt-20 max-w-6xl mx-auto">
               {[
                  { title: "Add Your\nContent", icon: FolderPlus },
                  { title: "AI-Powered\nInsights", icon: Wrench },
                  { title: "Smart\nOrganization", icon: GalleryVerticalEnd },
                  { title: "Ask\nQuestions", icon: MessageSquare },
                  { title: "Get\nAnswers", icon: CheckCircle }
               ].map((feature, idx) => (
                  <motion.div
                     key={idx}
                     initial={{ opacity: 0, y: 24 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true, margin: "-40px" }}
                     transition={{ duration: 0.4, delay: idx * 0.06 }}
                     className="relative group flex flex-col items-center justify-between text-center min-h-[240px] sm:min-h-[280px] lg:min-h-[300px] p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-zinc-900/95 to-zinc-950 border border-zinc-800/60 hover:border-zinc-600/70 transition-all duration-300 overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-zinc-900/50 hover:-translate-y-1"
                  >
                     {/* Subtle top highlight */}
                     <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-600/50 to-transparent opacity-60" />

                     {/* Arc Ripples - scaled for larger cards */}
                     <div className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-40 sm:h-40">
                        <div className="absolute inset-0 rounded-full border-t border-l border-r border-b-0 border-zinc-700/40 scale-[0.5]" />
                        <div className="absolute inset-0 rounded-full border-t border-l border-r border-b-0 border-zinc-700/30 scale-[0.7]" />
                        <div className="absolute inset-0 rounded-full border-t border-l border-r border-b-0 border-zinc-700/20 scale-[0.9]" />
                     </div>

                     {/* Icon */}
                     <div className="relative z-10 flex-1 flex items-center justify-center min-h-[100px]">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center shadow-inner group-hover:border-zinc-500/60 group-hover:bg-zinc-800/90 transition-all duration-300">
                           <feature.icon className="w-7 h-7 sm:w-8 sm:h-8 text-zinc-400 group-hover:text-white transition-colors duration-300" />
                        </div>
                     </div>

                     {/* Title */}
                     <div className="relative z-10 w-full pt-4">
                        <h3 className="text-base sm:text-lg font-semibold text-zinc-300 leading-snug whitespace-pre-line group-hover:text-white transition-colors">
                           {feature.title}
                        </h3>
                     </div>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* Footer */}
      <section className="relative pt-16 pb-20 md:pt-20 md:pb-24 bg-black overflow-hidden border-t border-zinc-800/60">
         <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent" />
         <div className="relative w-full overflow-hidden leading-none select-none pointer-events-none">
            <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-y-4 rotate-[0.5deg]" />
            <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent translate-y-4 -rotate-[0.5deg]" />
            <h1
              className="text-[18vw] sm:text-[16vw] font-bold text-center tracking-[-0.04em]"
              style={{
                color: "transparent",
                WebkitTextStroke: "1px rgba(255, 255, 255, 0.15)",
              }}
            >
              WEBMIND
            </h1>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent h-full w-full z-10" />
         </div>

         <div className="relative z-20 mt-12 md:mt-16 text-center px-6">
            <p className="text-zinc-500 text-sm font-mono">
               Made by{" "}
               <a
                 href="https://x.com/saeedsaiyedtwt"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="text-zinc-400 hover:text-white transition-colors underline decoration-zinc-600 underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded"
               >
                 @saeedsaiyedtwt
               </a>
            </p>
         </div>
      </section>
    </div>
  );
}
