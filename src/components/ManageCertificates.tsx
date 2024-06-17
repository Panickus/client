import React, { useState, useEffect } from 'react';
import axiosClient from '../config/axiosClient';

interface Certificate {
  _id: string;
  title: string;
  organization: string;
  date: string;
  description: string;
  image: string;  // Asegurarse de que sea siempre un string
}

interface NewCertificate {
  title: string;
  organization: string;
  date: string;
  description: string;
  image: string | File;  // Puede ser string o File
}

const ManageCertificates: React.FC = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [newCertificate, setNewCertificate] = useState<NewCertificate>({ title: '', organization: '', date: '', description: '', image: '' });

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await axiosClient.get('/certificates');
        setCertificates(response.data);
      } catch (error) {
        console.error('Error fetching certificates:', error);
      }
    };

    fetchCertificates();
  }, []);

  const handleEditClick = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setNewCertificate({
      title: certificate.title,
      organization: certificate.organization,
      date: certificate.date,
      description: certificate.description,
      image: certificate.image,
    });
  };

  const handleDeleteClick = async (id: string) => {
    try {
      await axiosClient.delete(`/certificates/${id}`);
      setCertificates(certificates.filter(certificate => certificate._id !== id));
    } catch (error) {
      console.error('Error deleting certificate:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCertificate({ ...newCertificate, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setNewCertificate({ ...newCertificate, image: e.target.files[0] });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', newCertificate.title);
    formData.append('organization', newCertificate.organization);
    formData.append('date', newCertificate.date);
    formData.append('description', newCertificate.description);
    if (newCertificate.image instanceof File) {
      formData.append('image', newCertificate.image);
    }

    try {
      if (selectedCertificate) {
        // Edit existing certificate
        const response = await axiosClient.put(`/certificates/${selectedCertificate._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setCertificates(certificates.map(certificate =>
          certificate._id === selectedCertificate._id ? response.data : certificate
        ));
      } else {
        // Create new certificate
        const response = await axiosClient.post('/certificates', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setCertificates([...certificates, response.data]);
      }
      setNewCertificate({ title: '', organization: '', date: '', description: '', image: '' });
      setSelectedCertificate(null);
    } catch (error) {
      console.error('Error saving certificate:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Certificates</h2>
      <form onSubmit={handleFormSubmit} className="mb-8 space-y-4">
        <input
          type="text"
          name="title"
          value={newCertificate.title}
          onChange={handleInputChange}
          placeholder="Title"
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="organization"
          value={newCertificate.organization}
          onChange={handleInputChange}
          placeholder="Organization"
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="date"
          name="date"
          value={newCertificate.date}
          onChange={handleInputChange}
          placeholder="Date"
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="description"
          value={newCertificate.description}
          onChange={handleInputChange}
          placeholder="Description"
          required
          className="w-full p-2 border rounded"
        />
        <input type="file" name="image" onChange={handleFileChange} className="w-full p-2 border rounded" />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 transition">
          {selectedCertificate ? 'Update Certificate' : 'Add Certificate'}
        </button>
      </form>

      <ul className="space-y-4">
        {certificates.map(certificate => (
          <li key={certificate._id} className="border p-4 rounded">
            <p className="mb-2">
              {certificate.title} - {certificate.organization} - {certificate.date}
            </p>
            {certificate.image && <img src={certificate.image} alt={certificate.title} className="w-32 mb-2" />}
            <button onClick={() => handleEditClick(certificate)} className="bg-green-500 text-white p-2 rounded mr-2 hover:bg-green-700 transition">Edit</button>
            <button onClick={() => handleDeleteClick(certificate._id)} className="bg-red-500 text-white p-2 rounded hover:bg-red-700 transition">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageCertificates;
