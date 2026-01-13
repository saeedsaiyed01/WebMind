import { Check, CreditCard, Flame, Globe, MessageSquare } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import NewNavbar from '../components/ui/NewNavbar';

const handlePayment = async (plan: string) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/signin';
      return;
    }

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000/api/v1'}/create-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        plan: plan.toLowerCase(),
      })
    });

    const data = await response.json();

    if (response.ok) {
      window.location.href = data.checkout_url;
    } else {
      console.error('Payment creation failed:', data.error);
      alert('Failed to create payment session. Please try again.');
    }
  } catch (error) {
    console.error('Payment error:', error);
    alert('An error occurred. Please try again.');
  }
};

const PricingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-black min-h-screen text-white selection:bg-zinc-800 overflow-x-hidden">
      <NewNavbar variant="landing" />

      {/* Pricing Section from Landing Page */}
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
                        {[
                            'Up to 100 documents',
                            'Basic AI insights',
                            'Community support',
                            'Standard search',
                            '20 AI credits'
                        ].map((item, i) => (
                           <li key={i} className="flex items-center gap-3 text-zinc-500 text-sm">
                              <Check className="w-4 h-4 text-zinc-600" />
                              {item}
                           </li>
                        ))}
                     </ul>
                  </div>
                  
                  <button 
                    onClick={() => navigate('/signup')}
                    className="w-full mt-8 py-3 rounded-xl border border-zinc-800 text-zinc-300 font-medium text-sm hover:bg-zinc-900 hover:text-white transition-all"
                  >
                     Get Started
                  </button>
               </div>

               {/* Pro Package - Highlighted (Middle) */}
               <div className="relative p-8 rounded-3xl bg-[#0c0c0c] border border-zinc-700/60 flex flex-col h-full shadow-[0_0_50px_rgba(0,0,0,0.5)] z-10 scale-[1.02]">
                  <div className="w-12 h-12 rounded-full bg-zinc-900/50 border border-zinc-800 flex items-center justify-center mb-6">
                     <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-medium text-white mb-1">Pro Package</h3>
                  <p className="text-zinc-500 text-xs mb-8">Most Popular</p>
                  
                  <div className="flex items-baseline gap-1 mb-8">
                     <span className="text-4xl font-serif text-white">$8</span>
                     <span className="text-zinc-600 text-sm">/ per month</span>
                  </div>
                  <div className="h-px w-full bg-zinc-800 mb-8" />
                  
                  <div className="flex-grow">
                     <p className="text-zinc-400 text-sm font-medium mb-4">What you will get</p>
                     <ul className="space-y-4">
                        {[
                            'Unlimited documents',
                            'Advanced AI insights',
                            'Priority support',
                            'Advanced search & filters',
                            'Custom integrations'
                        ].map((item, i) => (
                           <li key={i} className="flex items-center gap-3 text-zinc-400 text-sm">
                              <Check className="w-4 h-4 text-white" />
                              {item}
                           </li>
                        ))}
                     </ul>
                  </div>
                  
                  <button 
                    onClick={() => handlePayment('Pro')}
                    className="w-full mt-8 py-3 rounded-xl bg-white text-black font-medium text-sm hover:bg-zinc-200 transition-all shadow-lg shadow-white/5"
                  >
                     Upgrade to Pro
                  </button>
               </div>

               {/* Premium Package */}
               <div className="relative p-8 rounded-3xl bg-[#0c0c0c] border border-zinc-800/60 flex flex-col h-full hover:border-zinc-700/50 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-zinc-900/50 border border-zinc-800 flex items-center justify-center mb-6">
                     <Globe className="w-6 h-6 text-zinc-400" />
                  </div>
                  <h3 className="text-xl font-medium text-white mb-1">Premium Package</h3>
                  <p className="text-zinc-500 text-xs mb-8">For Power Users</p>
                  
                  <div className="flex items-baseline gap-1 mb-8">
                     <span className="text-4xl font-serif text-white">$16</span>
                     <span className="text-zinc-600 text-sm">/ per month</span>
                  </div>
                  <div className="h-px w-full bg-zinc-900 mb-8" />
                  
                  <div className="flex-grow">
                     <p className="text-zinc-400 text-sm font-medium mb-4">What you will get</p>
                     <ul className="space-y-4">
                        {[
                            'Everything in Pro',
                            'Real-time collaboration',
                            'API access',
                            'White-label options',
                            'Dedicated account manager'
                        ].map((item, i) => (
                           <li key={i} className="flex items-center gap-3 text-zinc-500 text-sm">
                              <Check className="w-4 h-4 text-zinc-600" />
                              {item}
                           </li>
                        ))}
                     </ul>
                  </div>
                  
                  <button 
                    onClick={() => handlePayment('Premium')}
                    className="w-full mt-8 py-3 rounded-xl border border-zinc-800 text-zinc-300 font-medium text-sm hover:bg-zinc-900 hover:text-white transition-all"
                  >
                     Go Premium
                  </button>
               </div>

            </div>
         </div>
      </section>
    </div>
  );
};

export default PricingPage;
