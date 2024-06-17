import React, { useState, useEffect } from 'react';
import axiosClient from '../config/axiosClient';

interface Project {
  _id: string;
  name: string;
  description: string;
  githubLink: string;
  images: string[];
  captureImage: string;
}

const ManageProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [newProject, setNewProject] = useState({ name: '', description: '', githubLink: '', images: [] as any });

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

  const handleEditClick = (project: Project) => {
    setSelectedProject(project);
    setNewProject({
      name: project.name,
      description: project.description,
      githubLink: project.githubLink,
      images: project.images,
    });
  };

  const handleDeleteClick = async (id: string) => {
    try {
      await axiosClient.delete(`/projects/${id}`);
      setProjects(projects.filter(project => project._id !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProject({ ...newProject, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewProject({ ...newProject, images: Array.from(e.target.files) });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', newProject.name);
    formData.append('description', newProject.description);
    formData.append('githubLink', newProject.githubLink);
    newProject.images.forEach((image: File) => {
      formData.append('images', image); // Asegúrate de que el nombre del campo sea 'images'
    });

    try {
      if (selectedProject) {
        // Edit existing project
        await axiosClient.put(`/projects/${selectedProject._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        // Update the projects state
        setProjects(projects.map(project =>
          project._id === selectedProject._id ? { ...project, ...newProject } : project
        ));
      } else {
        // Create new project
        const response = await axiosClient.post('/projects', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setProjects([...projects, response.data]);
      }
      setNewProject({ name: '', description: '', githubLink: '', images: [] });
      setSelectedProject(null);
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Projects</h2>
      <form onSubmit={handleFormSubmit} className="mb-8 space-y-4">
        <input
          type="text"
          name="name"
          value={newProject.name}
          onChange={handleInputChange}
          placeholder="Name"
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="description"
          value={newProject.description}
          onChange={handleInputChange}
          placeholder="Description"
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="githubLink"
          value={newProject.githubLink}
          onChange={handleInputChange}
          placeholder="GitHub Link"
          required
          className="w-full p-2 border rounded"
        />
        <input type="file" name="images" onChange={handleFileChange} multiple className="w-full p-2 border rounded" />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 transition">
          {selectedProject ? 'Update Project' : 'Add Project'}
        </button>
      </form>

      <ul className="space-y-4">
        {projects.map(project => (
          <li key={project._id} className="border p-4 rounded">
            <p className="mb-2">
              {project.name} - {project.description} - <a href={project.githubLink} className="text-blue-500">View Project</a>
            </p>
            {project.captureImage && <img src={project.captureImage} alt={project.name} className="w-32 mb-2" />}
            <button onClick={() => handleEditClick(project)} className="bg-green-500 text-white p-2 rounded mr-2 hover:bg-green-700 transition">Edit</button>
            <button onClick={() => handleDeleteClick(project._id)} className="bg-red-500 text-white p-2 rounded hover:bg-red-700 transition">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageProjects;
