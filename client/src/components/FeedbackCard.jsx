import { motion } from 'framer-motion';

const FeedbackCard = ({ title, description, icon }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">
        {title}
      </h3>
      <p className="text-gray-600">
        {description}
      </p>
    </motion.div>
  );
};

export default FeedbackCard; 