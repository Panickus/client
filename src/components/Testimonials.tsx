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

const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axiosClient.get('/testimonials');
        setTestimonials(response.data);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold">Testimonials</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {testimonials.map((testimonial) => (
          <div key={testimonial._id} className="bg-white dark:bg-secondary p-4 rounded shadow">
            {testimonial.image && (
              <img src={testimonial.image} alt={testimonial.name} className="w-full h-64 object-cover mb-4 rounded" />
            )}
            <h3 className="font-semibold">{testimonial.name}</h3>
            <p className="text-gray-500">{testimonial.position} at {testimonial.company}</p>
            <p>{testimonial.testimonial}</p>
            {testimonial.companyLogo && (
              <img src={testimonial.companyLogo} alt={`${testimonial.company} logo`} className="w-16 h-16 object-cover mt-4 rounded-full" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
