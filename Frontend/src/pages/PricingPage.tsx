import { Check } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import NewNavbar from '../components/ui/NewNavbar';

const handlePayment = async (plan: string) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirect to sign in if not logged in
      window.location.href = '/signin';
      return;
    }

    const response = await fetch('http://localhost:8001/api/v1/create-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify({
        plan: plan.toLowerCase(),
        // Add any additional data if needed
      })
    });

    const data = await response.json();

    if (response.ok) {
      // Redirect to payment URL
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

  const plans = [
    {
      name: 'Free',
      price: 0,
      features: [
        'Up to 100 documents',
        'Basic AI insights',
        'Community support',
        'Standard search',
      ],
      buttonText: 'Get Started',
      buttonAction: () => navigate('/signup'),
    },
    {
      name: 'Pro',
      price: 8,
      badge: 'Most Popular',
      features: [
        'Unlimited documents',
        'Advanced AI insights',
        'Priority support',
        'Advanced search & filters',
        'Custom integrations',
      ],
      buttonText: 'Upgrade to Pro',
      buttonAction: () => handlePayment('Pro'),
    },
    {
      name: 'Premium',
      price: 16,
      features: [
        'Everything in Pro',
        'Real-time collaboration',
        'API access',
        'White-label options',
        'Dedicated account manager',
      ],
      buttonText: 'Go Premium',
      buttonAction: () => handlePayment('Premium'),
    },
  ];

  return (
    <div className="bg-white dark:bg-black min-h-screen text-black dark:text-white">
      <NewNavbar variant="landing" />

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Choose Your Plan
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Simple and transparent pricing for everyone.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-8 ${
                index === 1 ? 'ring-2 ring-purple-600 dark:ring-purple-400' : ''
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  {plan.badge}
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                  ${plan.price}
                  <span className="text-lg text-gray-500 dark:text-gray-400">
                    /month
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-700 dark:text-gray-300">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={plan.buttonAction}
                className={`w-full py-3 px-4 rounded-lg font-medium transition ${
                  index === 1
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
