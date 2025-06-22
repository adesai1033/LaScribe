import { motion } from 'framer-motion';

interface HeroSectionProps {
  onGetStartedClick: () => void;
}

const HeroSection = ({ onGetStartedClick }: HeroSectionProps) => {
  return (
    <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          {/* Main Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
          >
            Transform Handwritten
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Documents to LaTeX
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
          >
            Upload your handwritten PDF documents and instantly convert them to clean, 
            professional LaTeX code. Perfect for students, researchers, and academics.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onGetStartedClick}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto"
            >
              Start Converting Now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg hover:border-blue-600 hover:text-blue-600 transition-all duration-200 w-full sm:w-auto"
            >
              Watch Demo
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">99%</div>
              <div className="text-gray-600">Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">10s</div>
              <div className="text-gray-600">Average Processing</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">50K+</div>
              <div className="text-gray-600">Documents Processed</div>
            </div>
          </motion.div>
        </div>

        {/* Visual Element */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16 relative"
        >
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-sm text-gray-500">LaScribe Editor</div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 font-mono text-sm">
                <div className="text-blue-600">\documentclass&#123;article&#125;</div>
                <div className="text-blue-600">\usepackage&#123;amsmath&#125;</div>
                <div className="text-blue-600">\begin&#123;document&#125;</div>
                <div className="ml-4 text-gray-800">\title&#123;Mathematical Analysis&#125;</div>
                <div className="ml-4 text-gray-800">\author&#123;Your Name&#125;</div>
                <div className="ml-4 text-gray-800">\maketitle</div>
                <div className="ml-4 text-gray-800">\section&#123;Introduction&#125;</div>
                <div className="ml-4 text-gray-800">The quadratic formula is:</div>
                <div className="ml-8 text-green-600">\[x = \frac&#123;-b \pm \sqrt&#123;b^2 - 4ac&#125;&#125;&#123;2a&#125;\]</div>
                <div className="text-blue-600">\end&#123;document&#125;</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection; 