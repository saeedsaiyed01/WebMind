import { motion } from "framer-motion";
import { Bot, Check, CreditCard, Flame, Globe, Layers, MessageSquare, Settings, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LampContainer } from "../components/ui/lamp.tsx";
import NewNavbar from "../components/ui/NewNavbar.tsx";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full overflow-x-hidden bg-black">
      <NewNavbar variant="landing" />
      <LampContainer>
        <div className="flex flex-col items-center">
          <motion.h1
            initial={{ opacity: 0.5, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="bg-gradient-to-br from-white to-zinc-400 py-4 bg-clip-text text-center text-5xl font-bold tracking-tight text-transparent md:text-7xl leading-none"
          >
            All Your Digital <br /> Memory Unleashed
          </motion.h1>
          
          <motion.p
             initial={{ opacity: 0, y: 50 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.5, duration: 0.8 }}
             className="mt-6 text-center text-zinc-400 max-w-2xl mx-auto text-lg md:text-xl font-light"
          >
            WebMind stores every tweet, note, and document, transforming your content into a powerful queryable personal knowledge base
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mt-10 flex gap-6 items-center flex-col sm:flex-row"
          >
            <button 
              onClick={() => navigate('/signup')}
              className="px-8 py-3.5 rounded-full bg-white text-black font-semibold hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] text-sm md:text-base"
            >
              Try Now
            </button>
            <button 
              onClick={() => navigate('/about')}
              className="px-8 py-3.5 rounded-full bg-[#111] border border-zinc-700 text-white font-medium hover:bg-[#222] transition-all text-sm md:text-base"
            >
              Learn More
            </button>
          </motion.div>

          {/* Dashboard Mockup - Floating Effect */}
          <motion.div
             initial={{ opacity: 0, y: 100, scale: 0.9 }}
             whileInView={{ opacity: 1, y: 0, scale: 1 }}
             transition={{ delay: 0.9, duration: 1.0, ease: "easeOut" }}
             className="mt-20 w-full max-w-6xl mx-auto relative z-20"
          >
             {/* Glow Effect behind dashboard */}
             <div className="absolute -inset-1 bg-gradient-to-r from-zinc-700 to-zinc-800 rounded-2xl blur opacity-20" />
             
             <div className="relative rounded-xl overflow-hidden shadow-2xl border border-zinc-800">
                <img 
                   src="/newheropage.png" 
                   alt="WebMind Dashboard Preview" 
                   className="w-full h-auto object-cover"
                />
             </div>
          </motion.div>
        </div>
      </LampContainer>

      {/* Why Choose Our Chatbot Section - Matching Reference Exactly */}
      <section className="py-24 relative z-20 bg-black overflow-hidden">
         {/* Curved Horizon Light Effect - Above Title */}
         <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[700px] h-[300px] pointer-events-none">
            {/* Main curved line */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-500/50 to-transparent" 
                 style={{ borderRadius: '0 0 50% 50% / 0 0 100% 100%' }} />
            {/* Glow underneath */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[100px] bg-zinc-600/10 blur-[50px]" 
                 style={{ borderRadius: '50%' }} />
         </div>

         <div className="container mx-auto px-6 relative z-10 pt-16">
            <div className="text-center max-w-3xl mx-auto mb-12">
               {/* Pill Badge */}
               <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 mb-6 backdrop-blur-sm">
                   <Sparkles className="w-3 h-3 text-zinc-500" />
                   <span className="text-zinc-400 text-xs font-medium tracking-wide">Why Choose Our Chatbot</span>
               </div>
               
               {/* Main Title - Elegant Serif */}
               <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif italic font-normal text-white mb-5 tracking-tight leading-tight">
                  Revolutionize Communication Now
               </h2>
               <p className="text-zinc-500 text-sm leading-relaxed max-w-lg mx-auto">
                  Transform your communication and streamline your workflow with AI-driven automation that enhances productivity and delivers seamless interactions
               </p>
            </div>

            {/* Horizontal Card Row */}
            <div className="flex flex-wrap justify-center gap-4 mt-16">
               {[
                  { title: "Cutting\nEdge AI", icon: <Bot className="w-5 h-5 text-zinc-500" /> },
                  { title: "Seamless\nIntegration", icon: <Settings className="w-5 h-5 text-zinc-500" /> },
                  { title: "Personalized\nConversations", icon: <MessageSquare className="w-5 h-5 text-zinc-500" /> },
                  { title: "24/7\nAvailability", icon: <Sparkles className="w-5 h-5 text-zinc-500" /> },
                  { title: "User-Friendly\nInterface", icon: <Layers className="w-5 h-5 text-zinc-500" /> }
               ].map((feature, idx) => (
                  <div key={idx} className="relative group flex flex-col items-center justify-between text-center w-[140px] h-[180px] rounded-xl bg-[#0c0c0c] border border-zinc-900/60 hover:border-zinc-800/80 transition-all duration-300 overflow-hidden">
                     
                     {/* Arc Ripples - Semi-circular waves emanating from icon */}
                     <div className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28">
                        {/* Arc 1 - Innermost */}
                        <div className="absolute inset-0 rounded-full border-t-[1.5px] border-l-[1.5px] border-r-[1.5px] border-b-0 border-zinc-700/50 scale-[0.4]" />
                        {/* Arc 2 */}
                        <div className="absolute inset-0 rounded-full border-t-[1.5px] border-l-[1.5px] border-r-[1.5px] border-b-0 border-zinc-700/40 scale-[0.55]" />
                        {/* Arc 3 */}
                        <div className="absolute inset-0 rounded-full border-t-[1.5px] border-l-[1.5px] border-r-[1.5px] border-b-0 border-zinc-700/30 scale-[0.7]" />
                        {/* Arc 4 - Outermost */}
                        <div className="absolute inset-0 rounded-full border-t-[1.5px] border-l-[1.5px] border-r-[1.5px] border-b-0 border-zinc-800/20 scale-[0.85]" />
                     </div>

                     {/* Icon Container */}
                     <div className="relative z-10 mt-auto mb-auto flex items-center justify-center" style={{ marginTop: '50px' }}>
                        <div className="w-9 h-9 rounded-full bg-[#0c0c0c] border border-zinc-800/60 flex items-center justify-center">
                           {feature.icon}
                        </div>
                     </div>
                     
                     {/* Title - Two Lines at Bottom */}
                     <div className="relative z-10 pb-4 px-2">
                        <h3 className="text-xs font-medium text-zinc-400 leading-tight whitespace-pre-line">{feature.title}</h3>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 relative z-20 bg-black overflow-hidden">
         <div className="container mx-auto px-6 relative z-10">
            
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
               <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 mb-6 backdrop-blur-sm">
                   <CreditCard className="w-3 h-3 text-zinc-500" />
                   <span className="text-zinc-400 text-xs font-medium tracking-wide">Pricing</span>
               </div>
               
               <h2 className="text-4xl md:text-5xl font-serif italic font-normal text-white mb-6">
                  Choose the perfect plan to fit your business goals and budget
               </h2>
               <p className="text-zinc-500 text-base leading-relaxed max-w-2xl mx-auto">
                  Whether you're just getting started or looking to scale, we offer flexible pricing options that grow with you.
               </p>

               {/* Toggle */}
               <div className="flex items-center justify-center mt-8">
                  <div className="p-1 rounded-full bg-zinc-900 border border-zinc-800 inline-flex">
                     <button className="px-6 py-2 rounded-full bg-zinc-800 text-white text-sm font-medium shadow-sm transition-all">Monthly</button>
                     <button className="px-6 py-2 rounded-full text-zinc-500 text-sm font-medium hover:text-zinc-300 transition-all">Annually</button>
                  </div>
               </div>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
               
               {/* Free Package */}
               <div className="relative p-8 rounded-3xl bg-[#0c0c0c] border border-zinc-800/60 flex flex-col h-full hover:border-zinc-700/50 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-zinc-900/50 border border-zinc-800 flex items-center justify-center mb-6">
                     <Flame className="w-6 h-6 text-zinc-400" />
                  </div>
                  <h3 className="text-xl font-medium text-white mb-1">Free Package</h3>
                  <p className="text-zinc-500 text-xs mb-8">Best for personal use.</p>
                  
                  <div className="text-4xl font-serif text-white mb-8">FREE</div>
                  <div className="h-px w-full bg-zinc-900 mb-8" />
                  
                  <div className="flex-grow">
                     <p className="text-zinc-400 text-sm font-medium mb-4">What you will get</p>
                     <ul className="space-y-4">
                        {["Basic AI Chatbot", "1 Integration", "Basic Analytics", "Predefined Templates", "Limited Customization", "Standard Support"].map((item, i) => (
                           <li key={i} className="flex items-center gap-3 text-zinc-500 text-sm">
                              <Check className="w-4 h-4 text-zinc-600" />
                              {item}
                           </li>
                        ))}
                     </ul>
                  </div>
                  
                  <button className="w-full mt-8 py-3 rounded-xl border border-zinc-800 text-zinc-300 font-medium text-sm hover:bg-zinc-900 hover:text-white transition-all">
                     Get Started
                  </button>
               </div>

               {/* Enterprise Package - Highlighted */}
               <div className="relative p-8 rounded-3xl bg-[#0c0c0c] border border-zinc-700/60 flex flex-col h-full shadow-[0_0_50px_rgba(0,0,0,0.5)] z-10 scale-[1.02]">
                  <div className="w-12 h-12 rounded-full bg-zinc-900/50 border border-zinc-800 flex items-center justify-center mb-6">
                     <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-medium text-white mb-1">Enterprise Package</h3>
                  <p className="text-zinc-500 text-xs mb-8">Tailored for Large Enterprises</p>
                  
                  <div className="flex items-baseline gap-1 mb-8">
                     <span className="text-4xl font-serif text-white">$250</span>
                     <span className="text-zinc-600 text-sm">/ per month</span>
                  </div>
                  <div className="h-px w-full bg-zinc-800 mb-8" />
                  
                  <div className="flex-grow">
                     <p className="text-zinc-400 text-sm font-medium mb-4">What you will get</p>
                     <ul className="space-y-4">
                        {["Premium AI Chatbot", "Unlimited Integrations", "Comprehensive Analytics", "24/7 Dedicated Support", "Enterprise-Grade Security", "Custom Solutions"].map((item, i) => (
                           <li key={i} className="flex items-center gap-3 text-zinc-400 text-sm">
                              <Check className="w-4 h-4 text-white" />
                              {item}
                           </li>
                        ))}
                     </ul>
                  </div>
                  
                  <button className="w-full mt-8 py-3 rounded-xl bg-white text-black font-medium text-sm hover:bg-zinc-200 transition-all shadow-lg shadow-white/5">
                     Get Started
                  </button>
               </div>

               {/* Business Package */}
               <div className="relative p-8 rounded-3xl bg-[#0c0c0c] border border-zinc-800/60 flex flex-col h-full hover:border-zinc-700/50 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-zinc-900/50 border border-zinc-800 flex items-center justify-center mb-6">
                     <Globe className="w-6 h-6 text-zinc-400" />
                  </div>
                  <h3 className="text-xl font-medium text-white mb-1">Business Package</h3>
                  <p className="text-zinc-500 text-xs mb-8">For Growing Businesses</p>
                  
                  <div className="flex items-baseline gap-1 mb-8">
                     <span className="text-4xl font-serif text-white">$120</span>
                     <span className="text-zinc-600 text-sm">/ per month</span>
                  </div>
                  <div className="h-px w-full bg-zinc-900 mb-8" />
                  
                  <div className="flex-grow">
                     <p className="text-zinc-400 text-sm font-medium mb-4">What you will get</p>
                     <ul className="space-y-4">
                        {["Advanced AI Chatbot", "Multiple Integrations", "Enhanced Analytics", "Customizable Workflows", "Priority Support", "Brand Customization"].map((item, i) => (
                           <li key={i} className="flex items-center gap-3 text-zinc-500 text-sm">
                              <Check className="w-4 h-4 text-zinc-600" />
                              {item}
                           </li>
                        ))}
                     </ul>
                  </div>
                  
                  <button className="w-full mt-8 py-3 rounded-xl border border-zinc-800 text-zinc-300 font-medium text-sm hover:bg-zinc-900 hover:text-white transition-all">
                     Get Started
                  </button>
               </div>

            </div>
         </div>
      </section>

      {/* Footer Section */}
      <section className="relative pt-24 pb-12 bg-black border-t border-zinc-900 overflow-hidden">
         <div className="container mx-auto px-6 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-24">
               {[
                  {
                     title: "Legal",
                     links: ["Privacy Policy", "Terms of Service", "Cookie Policy"]
                  },
                  {
                     title: "Products",
                     links: ["Features", "Pricing", "Updates"]
                  },
                  {
                     title: "Support",
                     links: ["Help Center", "Contact Support", "Knowledge Base", "FAQ"]
                  },
                  {
                     title: "Company",
                     links: ["About Us", "Our Story", "Leadership"]
                  },
                  {
                     title: "Careers",
                     links: ["Job Openings", "Internships", "Culture"]
                  },
                  {
                     title: "Social",
                     links: ["Follow Us", "Blog", "Community"]
                  }
               ].map((column, idx) => (
                  <div key={idx}>
                     <h4 className="text-white font-medium mb-6">{column.title}</h4>
                     <ul className="space-y-4">
                        {column.links.map((link, linkIdx) => (
                           <li key={linkIdx}>
                              <a href="#" className="text-zinc-500 hover:text-white transition-colors text-sm">
                                 {link}
                              </a>
                           </li>
                        ))}
                     </ul>
                  </div>
               ))}
            </div>
         </div>

         {/* Massive Footer Text with Light Trails */}
         <div className="relative w-full overflow-hidden leading-none select-none pointer-events-none mt-20">
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
      </section>
    </div>
  );
}
