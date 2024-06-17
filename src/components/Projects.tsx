import React, { useEffect, useState } from 'react';
import axiosClient from '../config/axiosConfig';

interface Project {
  _id: string;
  name: string;
  description: string;
  githubLink: string;
  images: string[];
  captureImage: string;
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axiosClient.get('/projects');
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold">Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {projects.map((project) => (
          <div key={project._id} className="bg-white dark:bg-secondary p-4 rounded shadow">
            {project.captureImage && (
              <img src={project.captureImage} alt={project.name} className="w-full h-64 object-cover mb-4 rounded" />
            )}
            <h3 className="font-semibold">{project.name}</h3>
            <p>{project.description}</p>
            <a href={project.githubLink} className="text-blue-500 hover:text-blue-700" target="_blank" rel="noopener noreferrer">
              View Project
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
