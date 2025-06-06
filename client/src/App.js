import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StatsSection from './components/StatsSection';
import FeedbackCard from './components/FeedbackCard';

function App() {
  const features = [
    {
      title: "AI Analysis",
      description: "Get detailed feedback on your work using advanced AI algorithms",
      icon: "🤖"
    },
    {
      title: "Instant Feedback",
      description: "Receive comprehensive feedback within seconds of submission",
      icon: "⚡"
    },
    {
      title: "Progress Tracking",
      description: "Monitor your improvement over time with detailed analytics",
      icon: "📈"
    }
  ];

  const benefits = [
    {
      title: "Save Time",
      description: "Get instant feedback without waiting for teacher review",
      icon: "⏱️"
    },
    {
      title: "Detailed Insights",
      description: "Receive comprehensive analysis of your work",
      icon: "🔍"
    },
    {
      title: "Personalized Learning",
      description: "Get feedback tailored to your specific needs",
      icon: "🎯"
    }
  ];

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navbar />
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <StatsSection />
              
              {/* Features Section */}
              <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                      Key Features
                    </h2>
                    <p className="text-lg text-gray-600">
                      Experience the power of AI-driven feedback
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                      <FeedbackCard key={index} {...feature} />
                    ))}
                  </div>
                </div>
              </section>

              {/* Benefits Section */}
              <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                      Why Choose Us
                    </h2>
                    <p className="text-lg text-gray-600">
                      Discover the advantages of our AI feedback system
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {benefits.map((benefit, index) => (
                      <FeedbackCard key={index} {...benefit} />
                    ))}
                  </div>
                </div>
              </section>

              {/* Footer */}
              <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">AI Feedback System</h2>
                    <p className="text-gray-400 mb-8">Empowering students with instant feedback</p>
                    <div className="flex justify-center space-x-6">
                      <a href="#" className="text-gray-400 hover:text-white">About Us</a>
                      <a href="#" className="text-gray-400 hover:text-white">Contact Us</a>
                      <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
                      <a href="#" className="text-gray-400 hover:text-white">Terms & Conditions</a>
                    </div>
                  </div>
                </div>
              </footer>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
