import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiYoutube } from 'react-icons/fi';

const projects = [
  {
    title: 'Claudia Reads Tiny Turtle by Daniel',
    description: 'Tiny Turtle is a book written by Daniel Wait in 2010 in 3rd grade. Chill it was my first publication. Only one copy ever made. Get yours today: $2,000,000 OBO',
    videoId: 'VLDgn9suEs0',
  },
  {
    title: 'Camera Basics',
    description: 'This video is about aperture, ISO, and shutter speed basics. Music- Royalty free- hotshot- scott holmes',
    videoId: 'fI-6iZ5MHaI',
  },
];

function Projects() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20">
      <div ref={ref} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
            Projects
          </h1>
        </motion.div>

        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">YouTube Videos</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            I take on every part of the YouTube video creation process, from planning to editing and posting, 
            which reflects my genuine passion for storytelling and my desire to share my ideas. 
            It inspires me to explore new topics and themes with each video.
          </p>
        </div>

        <div className="space-y-12">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -8 }}
              className="card-modern overflow-hidden"
            >
              <div className="md:flex">
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center">
                      <FiYoutube className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                      {project.title}
                    </h2>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {project.description}
                  </p>
                </div>
                <div className="md:w-1/2 bg-gray-100 dark:bg-gray-800">
                  <div className="aspect-video">
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${project.videoId}`}
                      title={project.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Projects;
