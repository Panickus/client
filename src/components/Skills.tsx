import React, { useEffect, useState } from 'react';
import axiosClient from '../config/axiosClient';

interface Skill {
  _id: string;
  name: string;
  level: string;
  image: string;
}

const Skills: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);

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

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold">Skills</h2>
      <div className="grid auto-rows-auto md:grid-cols-6 gap-4 mt-2">
        {skills.map((skill) => (
          <div key={skill._id} className="bg-white dark:bg-secondary p-4 rounded-lg shadow">
             <h3 className="font-bold pb-3">{skill.name}</h3>
            {skill.image && (
              <img src={skill.image} alt={skill.name} className="w-16 h-16  object-fit mb-4 rounded-full border-2 border-primary" />
            )}
           
            <p>{skill.level}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skills;
