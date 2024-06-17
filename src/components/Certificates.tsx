import React, { useEffect, useState } from 'react';
import axiosClient from '../config/axiosClient';

interface Certificate {
  _id: string;
  title: string;
  organization: string;
  date: string;
  description: string;
  image: string;
}

const Certificates: React.FC = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);

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

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold">Certificates</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {certificates.map((certificate) => (
          <div key={certificate._id} className="bg-white dark:bg-secondary p-4 rounded-xl shadow-xl">
            {certificate.image && (
              <img src={certificate.image} alt={certificate.title} className="w-full h-64 object-contain mb-4 rounded-t-xl border-2" />
            )}
            <h3 className="font-semibold">{certificate.title}</h3>
            <p>{certificate.organization}</p>
            <p>{certificate.date}</p>
            <p>{certificate.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Certificates;
