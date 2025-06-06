import { motion } from 'framer-motion';

const StatsSection = () => {
  const stats = [
    {
      number: "10,000+",
      label: "Submissions Analyzed",
      description: "Our AI has processed thousands of student submissions"
    },
    {
      number: "98%",
      label: "Accuracy Rate",
      description: "High precision feedback on student work"
    },
    {
      number: "24/7",
      label: "Instant Feedback",
      description: "Get feedback anytime, anywhere"
    }
  ];

  return (
    <section className="py-20 bg-[#0033FF] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our Impact
          </h2>
          <p className="text-lg text-gray-200">
            Empowering students with AI-driven feedback
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-5xl font-bold mb-4">{stat.number}</div>
              <div className="text-xl font-semibold mb-2">{stat.label}</div>
              <div className="text-gray-200">{stat.description}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection; 