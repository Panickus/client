import React, { useEffect, useState } from 'react';
import axiosClient from '../config/axiosClient';

interface Testimonial {
  _id: string;
  name: string;
  position: string;
  company: string;
  testimonial: string;
  companyLogo: string;
  image: string;
}

interface NewTestimonial {
  name: string;
  position: string;
  company: string;
  testimonial: string;
  companyLogo: string | File;
  image: string | File;
}

// Función de utilidad para verificar si una propiedad es de tipo File
const isFile = (value: any): value is File => {
  return value instanceof File;
};

const ManageTestimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [newTestimonial, setNewTestimonial] = useState<NewTestimonial>({
    name: '',
    position: '',
    company: '',
    testimonial: '',
    companyLogo: '',
    image: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [editTestimonial, setEditTestimonial] = useState<Testimonial | null>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const response = await axiosClient.get('/testimonials');
      setTestimonials(response.data);
    };

    fetchTestimonials();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editMode && editTestimonial) {
      setEditTestimonial({ ...editTestimonial, [name]: value });
    } else {
      setNewTestimonial({ ...newTestimonial, [name]: value });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      if (editMode && editTestimonial) {
        setEditTestimonial({ ...editTestimonial, [name]: file });
      } else {
        setNewTestimonial({ ...newTestimonial, [name]: file });
      }
    }
  };

  const handleAddTestimonial = async () => {
    const formData = new FormData();
    formData.append('name', newTestimonial.name);
    formData.append('position', newTestimonial.position);
    formData.append('company', newTestimonial.company);
    formData.append('testimonial', newTestimonial.testimonial);
    if (isFile(newTestimonial.companyLogo)) {
      formData.append('companyLogo', newTestimonial.companyLogo);
    } else {
      formData.append('companyLogo', newTestimonial.companyLogo);
    }
    if (isFile(newTestimonial.image)) {
      formData.append('image', newTestimonial.image);
    } else {
      formData.append('image', newTestimonial.image);
    }

    const response = await axiosClient.post('/testimonials', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    setTestimonials([...testimonials, response.data]);
    setNewTestimonial({
      name: '',
      position: '',
      company: '',
      testimonial: '',
      companyLogo: '',
      image: ''
    });
  };

  const handleEditTestimonial = async () => {
    if (editTestimonial) {
      const formData = new FormData();
      formData.append('name', editTestimonial.name);
      formData.append('position', editTestimonial.position);
      formData.append('company', editTestimonial.company);
      formData.append('testimonial', editTestimonial.testimonial);
      if (isFile(editTestimonial.companyLogo)) {
        formData.append('companyLogo', editTestimonial.companyLogo);
      }
      if (isFile(editTestimonial.image)) {
        formData.append('image', editTestimonial.image);
      }

      const response = await axiosClient.put(`/testimonials/${editTestimonial._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setTestimonials(testimonials.map(testimonial => (testimonial._id === editTestimonial._id ? response.data : testimonial)));
      setEditMode(false);
      setEditTestimonial(null);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    await axiosClient.delete(`/testimonials/${id}`);
    setTestimonials(testimonials.filter(testimonial => testimonial._id !== id));
  };

  const startEdit = (testimonial: Testimonial) => {
    setEditMode(true);
    setEditTestimonial(testimonial);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Testimonials</h1>
      <div className="mb-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={editMode && editTestimonial ? editTestimonial.name : newTestimonial.name}
          onChange={handleInputChange}
          className="p-2 border border-gray-300 rounded mr-2"
        />
        <input
          type="text"
          name="position"
          placeholder="Position"
          value={editMode && editTestimonial ? editTestimonial.position : newTestimonial.position}
          onChange={handleInputChange}
          className="p-2 border border-gray-300 rounded mr-2"
        />
        <input
          type="text"
          name="company"
          placeholder="Company"
          value={editMode && editTestimonial ? editTestimonial.company : newTestimonial.company}
          onChange={handleInputChange}
          className="p-2 border border-gray-300 rounded mr-2"
        />
        <input
          type="text"
          name="testimonial"
          placeholder="Testimonial"
          value={editMode && editTestimonial ? editTestimonial.testimonial : newTestimonial.testimonial}
          onChange={handleInputChange}
          className="p-2 border border-gray-300 rounded mr-2"
        />
        <input
          type="file"
          name="companyLogo"
          onChange={handleFileChange}
          className="p-2 border border-gray-300 rounded mr-2"
        />
        <input
          type="file"
          name="image"
          onChange={handleFileChange}
          className="p-2 border border-gray-300 rounded mr-2"
        />
        {editMode ? (
          <button onClick={handleEditTestimonial} className="bg-primary text-white p-2 rounded">Update Testimonial</button>
        ) : (
          <button onClick={handleAddTestimonial} className="bg-primary text-white p-2 rounded">Add Testimonial</button>
        )}
      </div>
      <ul>
        {testimonials.map(testimonial => (
          <li key={testimonial._id} className="mb-2 flex justify-between items-center">
            <span>{testimonial.name} ({testimonial.position} at {testimonial.company})</span>
            <div>
              <button onClick={() => startEdit(testimonial)} className="bg-yellow-500 text-white p-2 rounded mr-2">Edit</button>
              <button onClick={() => handleDeleteTestimonial(testimonial._id)} className="bg-red-500 text-white p-2 rounded">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageTestimonials;
