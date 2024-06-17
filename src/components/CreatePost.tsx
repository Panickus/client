import React, { useState } from 'react';
import axiosClient from '../config/axiosClient';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CreatePost: React.FC = () => {
  const [blogData, setBlogData] = useState({
    title: '',
    content: '',
    author: '',
    tags: '',
    image: null,
    authorAvatar: null,
    date: new Date(),
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBlogData({ ...blogData, [name]: value });
  };

  const handleContentChange = (value: string) => {
    setBlogData({ ...blogData, content: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const { name } = e.target;
      setBlogData({ ...blogData, [name]: e.target.files[0] });
    }
  };

  const handleDateChange = (date: Date) => {
    setBlogData({ ...blogData, date });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', blogData.title);
    formData.append('content', blogData.content);
    formData.append('author', blogData.author);
    formData.append('tags', blogData.tags);
    formData.append('date', blogData.date.toISOString());
    if (blogData.image) formData.append('image', blogData.image);
    if (blogData.authorAvatar) formData.append('authorAvatar', blogData.authorAvatar);

    try {
      await axiosClient.post('/blogs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Blog created successfully');
    } catch (error) {
      console.error('Error creating blog:', error);
      alert('Error creating blog');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Blog</h1>
      <form onSubmit={handleFormSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={blogData.title}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Content</label>
          <ReactQuill value={blogData.content} onChange={handleContentChange} />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Author</label>
          <input
            type="text"
            name="author"
            value={blogData.author}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Tags (comma separated)</label>
          <input
            type="text"
            name="tags"
            value={blogData.tags}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Publish Date</label>
          <DatePicker
            selected={blogData.date}
            onChange={handleDateChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Blog Image</label>
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Author Avatar</label>
          <input
            type="file"
            name="authorAvatar"
            onChange={handleFileChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          Create Blog
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
