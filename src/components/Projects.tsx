import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

export const Projects = () => {
  const projects = [
    {
      title: 'Real Estate',
      description: "Let's make something amazing together—your story, your space, your vision.",
      image: 'https://ashk6645.github.io/Images/renthouse.gif',
      link: 'https://realestate6645.vercel.app/',
    },
    {
      title: 'Brick Breaker Game',
      description: 'Brick Breaker Game developed in Java',
      image: 'https://ashk6645.github.io/Images/brickbreaker.gif',
      link: 'https://github.com/ashk6645/Brick-Breaker-Game',
    },
    {
      title: 'Sorting Algorithm Visualizer',
      description: 'Visual representation of Sorting Algorithms',
      image: 'https://ashk6645.github.io/Images/sorting.gif',
      link: 'https://sortingalgo6645.netlify.app/',
    },
    {
      title: 'Shortest Path Finder',
      description: 'Find the shortest path between two nodes',
      image: 'https://ashk6645.github.io/Images/shortestpath.gif',
      link: 'https://shortestpath6645.netlify.app/',
    },
    {
      title: 'Login Page',
      description: 'Login Page UI',
      image: 'https://ashk6645.github.io/Images/loginpage.gif',
      link: 'https://github.com/ashk6645/Login-Page',
    },
  ];

  return (
    <section id="projects" className="py-20 bg-gradient-to-r from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">My Work</h2>
          <p className="text-xl text-gray-600 mb-12">
            Here's a selection of some of my recent projects. I enjoy working on different types of projects to solve real-world problems.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {projects.map((project, index) => (
            <ProjectCard key={index} {...project} index={index} />
          ))}
        </div>
        <div className="text-center mt-12">
          <a
            href="https://github.com/ashk6645"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-rose-500 text-white px-8 py-3 rounded-lg hover:bg-rose-600 transition-colors text-lg"
          >
            See More Projects 
          </a>
        </div>
      </div>
    </section>
  );
};

const ProjectCard = ({ title, description, image, link, index }:any) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300"
    >
      <img
        src={image}
        alt={title}
        className="w-full h-64 object-cover rounded-xl transform transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-white text-xl font-semibold mb-2">{title}</h3>
          <p className="text-gray-200 mb-4">{description}</p>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-white hover:text-rose-300 transition-colors"
          >
            View Project <ExternalLink className="ml-2 w-4 h-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};
