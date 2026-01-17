import { motion } from "framer-motion";
import { CheckCircle, FolderPlus, GalleryVerticalEnd, MessageSquare, Sparkles, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LampContainer } from "../components/ui/lamp.tsx";
import NewNavbar from "../components/ui/NewNavbar.tsx";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full overflow-x-hidden bg-black dark">
      <NewNavbar variant="landing" />
      <LampContainer>
        <div className="flex flex-col items-center">
          <motion.h1
            initial={{ opacity: 0.5, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.1,
              duration: 0.5,
              ease: "easeInOut",
            }}
            className="mt-0 md:mt-[-70px] bg-gradient-to-br from-white to-zinc-400 py-4 bg-clip-text text-center text-4xl sm:text-5xl font-bold font-mono tracking-tight text-transparent md:text-7xl leading-none"
          >
            All Your Digital <br /> Memory Unleashed
          </motion.h1>
          
          <motion.p
             initial={{ opacity: 0, y: 50 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2, duration: 0.5 }}
             className="mt-6 text-center text-zinc-400 max-w-2xl mx-auto text-lg md:text-xl font-light"
          >
            WebMind stores every tweet, note, and document, transforming your content into a powerful queryable personal knowledge base
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-10 flex gap-6 items-center flex-col sm:flex-row"
          >
            <button 
              onClick={() => localStorage.getItem("token") ? navigate('/dashboard') : navigate('/signup')}
              className="cursor-pointer select-none inline-flex items-center duration-200 justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(255,255,255,0.3)] h-11 px-8"
            >
              {localStorage.getItem("token") ? "Go to Dashboard" : "Try Now"}
            </button>
            <button 
              onClick={() => navigate('/about')}
              className="px-8 py-3.5 rounded-full bg-[#111] border border-zinc-700 text-white font-medium hover:bg-[#222] transition-all text-sm md:text-base"
            >
              Learn More
            </button>
          </motion.div>

          {/* Dashboard Mockup - Floating Effect */}
             {/* Dashboard Mockup - Floating Effect */}
          <motion.div
             initial={{ opacity: 0, y: 100, scale: 0.9 }}
             animate={{ opacity: 1, y: 0, scale: 1 }}
             transition={{ delay: 0.4, duration: 0.5,  }}
             className="mt-12 md:mt-20 w-full max-w-6xl mx-auto relative z-20"
          >
             {/* Glow Effect behind dashboard */}
             <div className="absolute -inset-1 bg-gradient-to-r from-zinc-700 to-zinc-800 rounded-2xl blur opacity-20" />
             
             <div className="relative rounded-xl overflow-hidden shadow-2xl border border-zinc-800">
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

      {/* Why Choose Our Chatbot Section - Matching Reference Exactly */}
      <section id="features" className="py-16 md:py-24 relative z-20 bg-black overflow-hidden">
         {/* Curved Horizon Light Effect - Above Title */}
         <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[350px] md:w-[700px] h-[150px] md:h-[300px] pointer-events-none">
            {/* Main curved line */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-500/50 to-transparent" 
                 style={{ borderRadius: '0 0 50% 50% / 0 0 100% 100%' }} />
            {/* Glow underneath */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[100px] bg-zinc-600/10 blur-[50px]" 
                 style={{ borderRadius: '50%' }} />
         </div>

         <div className="container mx-auto px-6 relative z-10 pt-10 md:pt-16">
            <div className="text-center max-w-3xl mx-auto mb-12">
               {/* Pill Badge */}
               <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 mb-6 backdrop-blur-sm">
                   <Sparkles className="w-3 h-3 text-zinc-500" />
                   <span className="text-zinc-400 text-xs font-medium tracking-wide">Why Choose Our Chatbot</span>
               </div>
               
               {/* Main Title - Mono */}
               <h2 className="text-4xl md:text-5xl lg:text-6xl font-mono font-bold text-white mb-5 tracking-tight leading-tight">
                  Revolutionize Communication Now
               </h2>
               <p className="text-zinc-500 text-sm leading-relaxed max-w-lg mx-auto">
                  Transform your communication and streamline your workflow with AI-driven automation that enhances productivity and delivers seamless interactions
               </p>
            </div>

            {/* Horizontal Card Row */}
            <div className="flex flex-wrap justify-center gap-3 md:gap-6 mt-10 md:mt-16">
               {[
                  { title: "Add Your\nContent", icon: <FolderPlus className="w-6 h-6 text-zinc-500" /> },
                  { title: "AI-Powered\nInsights", icon: <Wrench className="w-6 h-6 text-zinc-500" /> },
                  { title: "Smart\nOrganization", icon: <GalleryVerticalEnd className="w-6 h-6 text-zinc-500" /> },
                  { title: "Ask\nQuestions", icon: <MessageSquare className="w-6 h-6 text-zinc-500" /> },
                  { title: "Get\nAnswers", icon: <CheckCircle className="w-6 h-6 text-zinc-500" /> }
               ].map((feature, idx) => (
                  <div key={idx} className="relative group flex flex-col items-center justify-between text-center w-[160px] h-[200px] md:w-[200px] md:h-[260px] rounded-2xl bg-[#0c0c0c] border border-zinc-900/60 hover:border-zinc-800/80 transition-all duration-300 overflow-hidden shadow-2xl">
                     
                     {/* Arc Ripples - Semi-circular waves emanating from icon */}
                     <div className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 md:w-48 md:h-48">
                        {/* Arc 1 - Innermost */}
                        <div className="absolute inset-0 rounded-full border-t-[1.5px] border-l-[1.5px] border-r-[1.5px] border-b-0 border-zinc-800/50 scale-[0.4]" />
                        {/* Arc 2 */}
                        <div className="absolute inset-0 rounded-full border-t-[1.5px] border-l-[1.5px] border-r-[1.5px] border-b-0 border-zinc-800/40 scale-[0.55]" />
                        {/* Arc 3 */}
                        <div className="absolute inset-0 rounded-full border-t-[1.5px] border-l-[1.5px] border-r-[1.5px] border-b-0 border-zinc-800/30 scale-[0.7]" />
                        {/* Arc 4 - Outermost */}
                        <div className="absolute inset-0 rounded-full border-t-[1.5px] border-l-[1.5px] border-r-[1.5px] border-b-0 border-zinc-800/20 scale-[0.85]" />
                     </div>

                     {/* Icon Container */}
                     <div className="relative z-10 mt-auto mb-auto flex items-center justify-center transform translate-y-2">
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#0c0c0c] border border-zinc-800/60 flex items-center justify-center shadow-lg">
                           {feature.icon}
                        </div>
                     </div>
                     
                     {/* Title - Two Lines at Bottom */}
                     <div className="relative z-10 pb-6 md:pb-8 px-3 md:px-4">
                        <h3 className="text-sm font-semibold text-zinc-300 leading-snug whitespace-pre-line group-hover:text-white transition-colors">{feature.title}</h3>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Footer Section - Massive Text Only */}
      <section className="relative pt-0 pb-12 bg-black overflow-hidden border-t border-zinc-900/50">
         {/* Massive Footer Text with Light Trails */}
         <div className="relative w-full overflow-hidden leading-none select-none pointer-events-none mt-10">
            {/* Light Trails/Streaks Effect */}
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-y-4 rotate-1" />
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent transform translate-y-4 -rotate-1" />
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent transform translate-y-12 rotate-2 blur-sm" />

            <h1 className="text-[19vw] font-bold text-center tracking-tighter"
                style={{
                   color: 'transparent',
                   WebkitTextStroke: '1px rgba(255, 255, 255, 0.2)',
                   zIndex: 0
                }}>
               WEBMIND
            </h1>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent h-full w-full z-10" />
         </div>

         {/* Credits */}
         <div className="absolute bottom-6 left-0 right-0 z-50 text-center">
            <p className="text-zinc-600 text-xs font-mono">
               Made by <a href="https://x.com/saeedsaiyedtwt" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors underline decoration-zinc-800 underline-offset-4">@saeedsaiyedtwt</a>
            </p>
         </div>
      </section>
    </div>
  );
}
