import React, { useEffect, useState } from 'react';
import axiosClient from '../config/axiosClient';

interface Blog {
  _id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  image?: string;
}

const BlogPage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axiosClient.get('/blogs');
        setBlogs(response.data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="container mx-auto p-4 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Blog</h1>
        <p className="text-xl">Bienvenido mi blog. Estáte atento a mis próximas publicaciones.</p>
      </header>
      <div className="flex flex-wrap -mx-4">
        <main className="w-full lg:w-2/3 px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {blogs.map((blog) => (
              <article key={blog._id} className="bg-white dark:bg-gray-800 p-4 rounded shadow">
                {blog.image && (
                  <img src={blog.image} alt={blog.title} className="w-full h-64 object-cover mb-4 rounded" />
                )}
                <h2 className="text-2xl font-semibold mb-2">{blog.title}</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-2">{blog.author}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{new Date(blog.createdAt).toLocaleDateString()}</p>
                <p className="mb-4">{blog.content.substring(0, 100)}...</p>
                <a href={`/blog/${blog._id}`} className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-600">Leer Más...</a>
              </article>
            ))}
          </div>
        </main>
        <aside className="w-full lg:w-1/3 px-4 mt-8 lg:mt-0">
          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-4">
            <h3 className="text-xl font-semibold mb-4">¿Quién soy</h3>
            <p className="text-gray-700 dark:text-gray-300">Conéceme más a traves mis publicaciones.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
            <h3 className="text-xl font-semibold mb-4">Publicaciones Recientes</h3>
            <ul className="text-gray-700 dark:text-gray-300">
              {blogs.slice(0, 5).map((blog) => (
                <li key={blog._id} className="mb-2">
                  <a href={`/blog/${blog._id}`} className="hover:underline">{blog.title}</a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BlogPage;


