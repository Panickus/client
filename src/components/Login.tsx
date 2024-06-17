import React, { useState } from 'react';
import axiosClient from '../config/axiosClient';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const Login: React.FC<{ isModal?: boolean; closeModal?: () => void }> = ({ isModal = false, closeModal }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosClient.post('/auth/login', {
        email,
        password,
      });
      localStorage.setItem('token', response.data.token); // Guardar el token en localStorage
      localStorage.setItem('user', JSON.stringify(response.data.user)); // Guardar la información del usuario en localStorage
      navigate('/');
      window.location.reload(); // Recargar la página para actualizar la NavBar
      if (isModal && closeModal) closeModal();
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`flex items-center justify-center ${isModal ? 'min-h-screen' : ''} bg-gray-100 dark:bg-secondary`}>
      <div className="bg-white dark:bg-gray-900 p-6 rounded shadow-md w-full max-w-md">
        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white text-center">
          Login
        </h3>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-white">Email</label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded mt-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4 relative">
            <label className="block text-gray-700 dark:text-white">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded mt-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="absolute right-3 top-1/2 cursor-pointer text-gray-700 dark:text-white"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </span>
          </div>
          <button type="submit" className="w-full bg-primary text-white p-2 rounded hover:bg-primary-dark">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
