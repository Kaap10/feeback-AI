import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative bg-white pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight"
          >
            <span className="block">AI-Powered</span>
            <span className="block text-[#0033FF] mt-2">Student Feedback System</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto"
          >
            Get instant, personalized feedback on your work. Our AI analyzes your submissions and provides detailed insights to help you improve.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link 
              to="/submit" 
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-[#0033FF] rounded-lg hover:bg-[#0022CC] transition-colors duration-200"
            >
              Submit Your Work
            </Link>
            <Link 
              to="/demo" 
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-[#0033FF] bg-white border-2 border-[#0033FF] rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Try Demo
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero; 