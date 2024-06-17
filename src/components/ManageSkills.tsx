import React, { useState, useEffect } from 'react';
import axiosClient from '../config/axiosClient';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';

interface Skill {
  _id: string;
  name: string;
  level: string;
  image: string;
}

const ManageSkills: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [newSkill, setNewSkill] = useState({ name: '', level: '', image: '' });

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axiosClient.get('/skills');
        setSkills(response.data);
      } catch (error) {
        console.error('Error fetching skills:', error);
      }
    };

    fetchSkills();
  }, []);

  const handleEditClick = (skill: Skill) => {
    setSelectedSkill(skill);
    setNewSkill({ name: skill.name, level: skill.level, image: skill.image });
  };

  const handleDeleteClick = async (id: string) => {
    try {
      await axiosClient.delete(`/skills/${id}`);
      setSkills(skills.filter(skill => skill._id !== id));
    } catch (error) {
      console.error('Error deleting skill:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSkill({ ...newSkill, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewSkill({ ...newSkill, image: e.target.files[0] });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', newSkill.name);
    formData.append('level', newSkill.level);
    if (newSkill.image instanceof File) {
      formData.append('image', newSkill.image);
    }

    try {
      if (selectedSkill) {
        // Edit existing skill
        await axiosClient.put(`/skills/${selectedSkill._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        // Update the skills state
        setSkills(skills.map(skill => (skill._id === selectedSkill._id ? { ...skill, ...newSkill } : skill)));
      } else {
        // Create new skill
        const response = await axiosClient.post('/skills', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setSkills([...skills, response.data]);
      }
      setNewSkill({ name: '', level: '', image: '' });
      setSelectedSkill(null);
    } catch (error) {
      console.error('Error saving skill:', error);
    }
  };

  return (
    <div className="mx-auto p-4 mt-2 bg-gray-100 dark:bg-gray-900">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Manage Skills</h2>
      <form onSubmit={handleFormSubmit} className="mb-4">
        <input
          type="text"
          name="name"
          value={newSkill.name}
          onChange={handleInputChange}
          placeholder="Name"
          required
          className="border p-2 rounded w-1/4 mb-2 text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-700"
        />
        <input
          type="text"
          name="level"
          value={newSkill.level}
          onChange={handleInputChange}
          placeholder="Level"
          required
          className="border p-2 rounded w-1/4 mb-2 text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-700"
        />
        <input
          type="file"
          name="image"
          onChange={handleFileChange}
          className="border p-2 rounded w-1/2 mb-2 text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-700"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-1/8"
        >
          {selectedSkill ? 'Update Skill' : 'Add Skill'}
        </button>
      </form>

      <ul className="grid auto-rows-auto md:grid-cols-6 gap-4">
        {skills.map(skill => (
          <li key={skill._id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-gray-900 dark:text-gray-100">{skill.name} - {skill.level}</p>
            {skill.image && (
              <img src={skill.image} alt={skill.name} className="w-20 h-20 object-cover mb-4 rounded-full" />
            )}
            <div className="flex space-x-2">
              <button onClick={() => handleEditClick(skill)} className="text-white hover:text-blue-700 bg-primary">
                <PencilIcon className="h-5 w-5" />
              </button>
              <button onClick={() => handleDeleteClick(skill._id)} className="text-white hover:text-red-700 bg-primary">
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageSkills;
