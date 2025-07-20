import { Twitter, Zap } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bglanding1 from "../assets/bglanding1.png";
import { Button } from "../components/ui/Button";
import { features, LandingPageCard } from "../components/ui/landingpageCards";
import NewNavbar from "../components/ui/NewNavbar";
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

  return (
    <div className="bg-white dark:bg-black min-h-screen text-black dark:text-white">
      <NewNavbar variant="landing" />
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center m-28 px-4 text-center gap-6  p-0">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-gray-300 dark:border-gray-600 rounded-full text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-transparent shadow-purple-500/40">
          <span className="text-purple-600 dark:text-purple-400">
            <Zap />
          </span>
          <span>AI-Powered Insights</span>
        </div>

        <div className="text-6xl text-gray-700 dark:text-gray-50">
          <span>All Your Digital </span>
          <br />
          <span>Memory Unleashed</span>
        </div>
        <div className="">
          <span>
            WebMind stores every tweet, note, and document, transformingy our
            content{" "}
          </span>
          <br />
          <span> into a powerful queryable personal knowledge base</span>
        </div>

        <Button
          size="md"
          variant="purple"
          text="Get Started"
          onClick={() => navigate("/signup")}
        />
      </div>

      <div className="mt-16 sm:mt-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="rounded-2xl bg-gray-900/5 p-2 shadow-2xl ring-1 ring-gray-900/10 sm:p-3">
            <img
              src={bglanding1}
              alt="Kaizen project management application dashboard"
              className="w-full rounded-lg"
            />
          </div>
        </div>
      </div>
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Section Header */}
          <div className="mx-auto max-w-2xl lg:text-center text-black dark:text-white">
            <h2 className="text-bas text-3xl   font-semibold leading-7 text-purple-400">
              How It Works
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-600 dark:text-white sm:text-4xl">
              From Chaos to Clarity
            </p>

            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400 ">
              WebMind gives you an intuitive interface to manage, search, and
              make sense of all your digital knowledge—no clutter, just clean,
              smart organization.
            </p>
          </div>

          {/* Grid container for the feature cards */}
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none text-gray-800">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* We map over the features array and render a Card for each item */}
              {features.map((feature, index) => (
                <LandingPageCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-2 border-t border-gray-300 dark:border-gray-700 py-6 px-4 flex justify-between items-center text-sm text-gray-500">
        <span className="pl-4">
          Designed and Developed by{" "}
          <span className="text-purple-400 font-semibold">Saeed</span>
        </span>

        <span className="pr-4 cursor-pointer" onClick={handleTwitter}>
          <Twitter />
        </span>
      </footer>
    </div>
  );
}

export default LandingPage;
