import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosClient from '../config/axiosClient';

interface Blog {
  _id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  image?: string;
}

const BlogDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axiosClient.get(`/blogs/${id}`);
        setBlog(response.data);
      } catch (error) {
        console.error('Error fetching blog:', error);
      }
    };

    fetchBlog();
  }, [id]);

  if (!blog) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{blog.title}</h1>
      {blog.image && (
        <img src={blog.image} alt={blog.title} className="w-full h-64 object-cover mb-4 rounded" />
      )}
      <p className="text-gray-700 dark:text-gray-300">{blog.author}</p>
      <p className="text-gray-500 dark:text-gray-400 text-sm">{new Date(blog.createdAt).toLocaleDateString()}</p>
      <div className="mt-4">{blog.content}</div>
    </div>
  );
};

export default BlogDetailPage;
