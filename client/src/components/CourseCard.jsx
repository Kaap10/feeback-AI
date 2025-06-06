import { motion } from 'framer-motion';

const CourseCard = ({ title, description, batch, logo, isNew, isComingSoon }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
    >
      <div className="p-6">
        {isNew && (
          <span className="inline-block px-3 py-1 text-sm font-medium text-white bg-[#0033FF] rounded-full mb-4">
            New Batch
          </span>
        )}
        
        <div className="flex items-center gap-4 mb-4">
          <img src={logo} alt={title} className="w-12 h-12" />
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        </div>
        
        <p className="text-gray-600 mb-6">{description}</p>
        
        {isComingSoon ? (
          <button className="w-full py-3 text-center text-gray-500 bg-gray-100 rounded-lg font-medium">
            Coming Soon
          </button>
        ) : (
          <button className="w-full py-3 text-center text-white bg-[#0033FF] rounded-lg font-medium hover:bg-[#0022CC] transition-colors duration-200">
            Join Now
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default CourseCard; 