import { motion } from 'framer-motion';

const FeaturesSection = () => {
  const features = [
    {
      icon: "📄",
      title: "PDF Upload",
      description: "Simply upload your handwritten PDF documents and let our AI do the rest."
    },
    {
      icon: "🤖",
      title: "AI Recognition",
      description: "Advanced machine learning algorithms accurately recognize handwritten text and mathematical symbols."
    },
    {
      icon: "⚡",
      title: "Fast Processing",
      description: "Get your LaTeX code in seconds, not minutes. Lightning-fast conversion for all document types."
    },
    {
      icon: "📊",
      title: "Mathematical Support",
      description: "Perfect for equations, formulas, and complex mathematical notation with high accuracy."
    },
    {
      icon: "🔒",
      title: "Secure & Private",
      description: "Your documents are processed securely and never stored permanently on our servers."
    },
    {
      icon: "📱",
      title: "Cross-Platform",
      description: "Access LaScribe from any device - desktop, tablet, or mobile. Works everywhere."
    }
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Why Choose LaScribe?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful features designed to make document conversion seamless and efficient
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Transform Your Documents?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Join thousands of students and researchers who trust LaScribe for their document conversion needs.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
            >
              Get Started Free
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection; 