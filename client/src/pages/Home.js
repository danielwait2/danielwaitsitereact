import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiArrowRight, FiLinkedin } from 'react-icons/fi';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

function Home() {
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [aboutRef, aboutInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [workRef, workInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-gray-900">
        {/* Ultra-Modern Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gray-200 dark:bg-gray-800 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gray-300 dark:bg-gray-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gray-100 dark:bg-gray-800 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse-slow" style={{ animationDelay: '4s' }}></div>
        </div>

        <motion.div
          ref={heroRef}
          variants={containerVariants}
          initial="hidden"
          animate={heroInView ? "visible" : "hidden"}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <motion.div variants={itemVariants} className="text-center lg:text-left">
              <motion.div
                initial={{ scale: 0 }}
                animate={heroInView ? { scale: 1 } : { scale: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="inline-block mb-6"
              >
                <span className="px-6 py-3 rounded-full bg-black dark:bg-white text-white dark:text-black text-sm font-bold shadow-xl">
                  Innovator · Energetic · Information Systems
                </span>
              </motion.div>
              
              <motion.h1
                variants={itemVariants}
                className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight"
              >
                <span className="block text-gray-900 dark:text-white mb-2">My name is</span>
                <span className="block gradient-text text-6xl md:text-7xl lg:text-8xl mb-4">Daniel Wait</span>
                <span className="block text-gray-700 dark:text-gray-300 mt-2 text-2xl md:text-3xl font-medium">
                  and I adapt quickly to elevate your vision with
                </span>
                <span className="block gradient-text mt-4 text-6xl md:text-7xl lg:text-8xl">Technology</span>
              </motion.h1>
              
              <motion.p
                variants={itemVariants}
                className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
              >
                Founder of <strong className="text-gray-900 dark:text-white">Wait Works LLC</strong>, I specialize in technology solutions and innovation. 
                Explore my <strong className="text-gray-900 dark:text-white">Wait List</strong> for curated insights and resources.
              </motion.p>
              
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link to="/wait-works">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-modern flex items-center space-x-2"
                  >
                    <span>Wait Works LLC</span>
                    <FiArrowRight />
                  </motion.button>
                </Link>
                <Link to="/wait-list">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-modern-outline flex items-center space-x-2"
                  >
                    <span>Wait List</span>
                    <FiArrowRight />
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Profile Image */}
            <motion.div
              variants={itemVariants}
              className="flex justify-center lg:justify-end"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gray-300 dark:bg-gray-700 blur-3xl opacity-30"></div>
                <div className="relative w-80 md:w-96 lg:w-[28rem] shadow-2xl border-4 border-gray-200 dark:border-gray-700">
                  <a
                    href="https://www.linkedin.com/in/danielwait2"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full group"
                  >
                    <img
                      src="/assets/profile.png"
                      alt="Daniel Wait"
                      className="w-full h-auto object-contain group-hover:opacity-90 transition-opacity duration-300"
                    />
                    <div className="absolute inset-0 bg-black dark:bg-white opacity-0 group-hover:opacity-20 dark:group-hover:opacity-10 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                      <FiLinkedin className="text-white dark:text-black text-5xl drop-shadow-lg" />
                    </div>
                  </a>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section
        ref={aboutRef}
        className="py-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={aboutInView ? "visible" : "hidden"}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
              About Me
            </h2>
          </motion.div>
          
          <motion.div
            variants={itemVariants}
            className="prose prose-lg dark:prose-invert max-w-none"
          >
            <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">
              Hi, I'm <strong className="text-gray-900 dark:text-white">Daniel Wait</strong>! I'm passionate about helping businesses thrive through technology. 
              As the founder of <strong className="text-gray-900 dark:text-white">Wait Works LLC</strong>, I've helped companies generate $80,000 in additional revenue 
              and save 30+ hours per week through smart automation and web development solutions.
            </p>
            
            <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">
              Currently pursuing my Information Systems degree at BYU with a 3.95 GPA, I'm not just a student—I'm 
              an active entrepreneur who's already making waves in the tech consulting world. I specialize in web development, 
              business process optimization, and data analytics, turning complex problems into elegant, user-friendly solutions.
            </p>
            
            <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">
              When I'm not coding or consulting, you'll find me playing ultimate frisbee, exploring hiking trails, 
              or capturing the world through photography. I believe the best solutions come from combining technical expertise 
              with a deep understanding of human needs—whether that's building an iOS app in two weeks or streamlining a 
              hotel's booking system to boost efficiency by 25%.
            </p>
            
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              I'm approachable, results-driven, and always excited to tackle new challenges. Let's build something 
              amazing together!
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Work Section */}
      <section
        ref={workRef}
        className="py-20 bg-gray-50 dark:bg-gray-800"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={workInView ? "visible" : "hidden"}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
              My Work
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Discover <strong>Wait Works LLC</strong> and explore my <strong>Wait List</strong> collection
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="card-modern p-8 group"
            >
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mb-6 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Wait Works LLC</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Professional technology consulting and business solutions. Founded by <strong>Daniel Wait</strong>, 
                <strong>Wait Works LLC</strong> specializes in custom software development, web applications, 
                and system integration to streamline your business operations.
              </p>
              <Link to="/wait-works">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-modern-outline"
                >
                  Learn More
                </motion.button>
              </Link>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="card-modern p-8 group"
            >
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mb-6 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Wait List</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Curated collection of interesting links, resources, and insights by <strong>Daniel Wait</strong>. 
                The <strong>Wait List</strong> features technology trends, innovation insights, and thought-provoking 
                content that I find valuable and worth sharing.
              </p>
              <Link to="/wait-list">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-modern-outline"
                >
                  Explore Collection
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </>
  );
}

export default Home;
