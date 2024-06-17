import React from 'react';

const Blogs: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Blogs</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">Blog Post 1</div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">Blog Post 2</div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">Blog Post 3</div>
      </div>
    </div>
  );
};

export default Blogs;
