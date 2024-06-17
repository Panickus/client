import React, { useState, useEffect } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import axiosClient from '../config/axiosClient';

const Profile: React.FC = () => {
  const [profile, setProfile] = useState({ email: '', avatar: '' });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosClient.get('/users/profile');
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'newPassword') setNewPassword(value);
    if (name === 'confirmPassword') setConfirmPassword(value);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const formData = new FormData();
      if (profile.email) formData.append('email', profile.email);
      if (newPassword) formData.append('password', newPassword);
      if (profile.avatar instanceof File) formData.append('avatar', profile.avatar);

      await axiosClient.put(`/users/profile`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfile({ ...profile, avatar: e.target.files[0] });
    }
  };

  return (
    <div className="mx-auto p-4 bg-white dark:bg-secondary text-black dark:text-white shadow-md">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <form onSubmit={handleFormSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleInputChange}
            className="mt-1 block w-1/3 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">New Password</label>
          <div className="relative">
            <input
              type={showNewPassword ? 'text' : 'password'}
              name="newPassword"
              value={newPassword}
              onChange={handlePasswordChange}
              className="mt-1 block w-1/3 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-gray-100 dark:bg-gray-800 text-black dark:text-white pr-10"
            />
            <div
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-500 dark:text-gray-300" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-500 dark:text-gray-300" />
              )}
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={confirmPassword}
              onChange={handlePasswordChange}
              className="mt-1 block w-1/3 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-gray-100 dark:bg-gray-800 text-black dark:text-white pr-10"
            />
            <div
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-500 dark:text-gray-300" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-500 dark:text-gray-300" />
              )}
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Avatar</label>
          <input type="file" name="avatar" onChange={handleFileChange} className="mt-1 block w-1/2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-gray-100 dark:bg-gray-800 text-black dark:text-white" />
        </div>
        <button type="submit" className="bg-blue-500 dark:bg-blue-700 text-white p-2 rounded hover:bg-blue-700 dark:hover:bg-blue-900 transition">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;
