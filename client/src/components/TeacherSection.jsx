import { motion } from 'framer-motion';

const TeacherSection = () => {
  const achievements = [
    "14+ Years of Experience",
    "Produced 1000+ ranks at IIT JEE",
    "Designed Best Math Crash Course for IIT JEE"
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Learn from Anup sir
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center md:text-left"
          >
            <ul className="space-y-4">
              {achievements.map((achievement, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="text-xl text-gray-700"
                >
                  {achievement}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-[#0033FF]">
                <img
                  src="/anup-sir.jpg"
                  alt="Anup sir"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-[#0033FF] text-white px-6 py-2 rounded-full">
                Anup sir
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TeacherSection; 