import { motion } from 'framer-motion';

const ShiningStars = () => {
  const students = [
    {
      name: "Shreshth Kumar",
      percentile: "99.8823806",
      subject: "Math"
    },
    {
      name: "Sabarish Nair",
      percentile: "99.7595184",
      subject: "Math"
    },
    {
      name: "Tanmay Jain",
      percentile: "99.5692884",
      subject: "Math"
    },
    {
      name: "Balivada V. Chaturya",
      percentile: "99.5493886",
      subject: "Math"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Shining Stars
          </h2>
          <p className="text-lg text-gray-600">
            Listen to the experience of our students who scored 99+ percentile in Math in JEE Main 2022
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {students.map((student, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-4">
                {/* Add student photo here */}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {student.name}
              </h3>
              <p className="text-[#0033FF] font-bold text-lg">
                {student.percentile} Percentile
              </p>
              <p className="text-gray-600">
                ({student.subject})
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShiningStars; 