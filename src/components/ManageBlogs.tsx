import React, { useEffect, useState } from 'react';
import axiosClient from '../config/axiosClient';

interface Blog {
  _id: string; // Cambié 'id' a '_id' para que coincida con el esquema MongoDB
  tags: string[];
  title: string;
  content: string;
  author: string;
  image: string | File;
  authorAvatar: string | File;
  date: string;
}

const ManageBlogs: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [newBlog, setNewBlog] = useState({ tags: [''], title: '', content: '', author: '', image: '', authorAvatar: '', date: '' });
  const [editMode, setEditMode] = useState(false);
  const [editBlog, setEditBlog] = useState<Blog | null>(null);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editMode && editBlog) {
      setEditBlog({ ...editBlog, [name]: value });
    } else {
      setNewBlog({ ...newBlog, [name]: value });
    }
  };

  const handleAddBlog = async () => {
    try {
      const formData = new FormData();
      formData.append('tags', newBlog.tags.join(','));
      formData.append('title', newBlog.title);
      formData.append('content', newBlog.content);
      formData.append('author', newBlog.author);
      if (newBlog.image instanceof File) {
        formData.append('image', newBlog.image);
      }
      if (newBlog.authorAvatar instanceof File) {
        formData.append('authorAvatar', newBlog.authorAvatar);
      }
      formData.append('date', newBlog.date);

      const response = await axiosClient.post('/blogs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setBlogs([...blogs, response.data]);
      setNewBlog({ tags: [''], title: '', content: '', author: '', image: '', authorAvatar: '', date: '' });
    } catch (error) {
      console.error('Error adding blog:', error);
      alert('Error adding blog');
    }
  };

  const handleEditBlog = async () => {
    if (editBlog) {
      try {
        const formData = new FormData();
        formData.append('tags', editBlog.tags.join(','));
        formData.append('title', editBlog.title);
        formData.append('content', editBlog.content);
        formData.append('author', editBlog.author);
        if (editBlog.image instanceof File) {
          formData.append('image', editBlog.image);
        }
        if (editBlog.authorAvatar instanceof File) {
          formData.append('authorAvatar', editBlog.authorAvatar);
        }
        formData.append('date', editBlog.date);

        const response = await axiosClient.put(`/blogs/${editBlog._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setBlogs(blogs.map(blog => (blog._id === editBlog._id ? response.data : blog)));
        setEditMode(false);
        setEditBlog(null);
      } catch (error) {
        console.error('Error editing blog:', error);
        alert('Error editing blog');
      }
    }
  };

  const handleDeleteBlog = async (id: string) => {
    try {
      await axiosClient.delete(`/blogs/${id}`);
      setBlogs(blogs.filter(blog => blog._id !== id));
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Error deleting blog');
    }
  };

  const startEdit = (blog: Blog) => {
    setEditMode(true);
    setEditBlog(blog);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Blogs</h1>
      <div className="mb-4">
        <input
          type="text"
          name="title"
          placeholder="Blog Title"
          value={editMode && editBlog ? editBlog.title : newBlog.title}
          onChange={handleInputChange}
          className="p-2 border border-gray-300 rounded mr-2"
        />
        <input
          type="text"
          name="author"
          placeholder="Author"
          value={editMode && editBlog ? editBlog.author : newBlog.author}
          onChange={handleInputChange}
          className="p-2 border border-gray-300 rounded mr-2"
        />
        <input
          type="text"
          name="content"
          placeholder="Content"
          value={editMode && editBlog ? editBlog.content : newBlog.content}
          onChange={handleInputChange}
          className="p-2 border border-gray-300 rounded mr-2"
        />
        <input
          type="file"
          name="image"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              const file = e.target.files[0];
              if (editMode && editBlog) {
                setEditBlog({ ...editBlog, image: file });
              } else {
                setNewBlog({ ...newBlog, image: file });
              }
            }
          }}
          className="p-2 border border-gray-300 rounded mr-2"
        />
        <input
          type="file"
          name="authorAvatar"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              const file = e.target.files[0];
              if (editMode && editBlog) {
                setEditBlog({ ...editBlog, authorAvatar: file });
              } else {
                setNewBlog({ ...newBlog, authorAvatar: file });
              }
            }
          }}
          className="p-2 border border-gray-300 rounded mr-2"
        />
        <input
          type="text"
          name="date"
          placeholder="Date"
          value={editMode && editBlog ? editBlog.date : newBlog.date}
          onChange={handleInputChange}
          className="p-2 border border-gray-300 rounded mr-2"
        />
        {editMode ? (
          <button onClick={handleEditBlog} className="bg-primary text-white p-2 rounded">Update Blog</button>
        ) : (
          <button onClick={handleAddBlog} className="bg-primary text-white p-2 rounded">Add Blog</button>
        )}
      </div>
      <ul>
        {blogs.map(blog => (
          <li key={blog._id} className="mb-2 flex justify-between items-center">
            <span>{blog.title}</span>
            <div>
              <button onClick={() => startEdit(blog)} className="bg-yellow-500 text-white p-2 rounded mr-2">Edit</button>
              <button onClick={() => handleDeleteBlog(blog._id)} className="bg-red-500 text-white p-2 rounded">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageBlogs;
