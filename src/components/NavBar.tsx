import React, { useState, useEffect, Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, ChevronDownIcon, CogIcon } from '@heroicons/react/24/outline';
import { UserIcon } from '@heroicons/react/24/solid';
import axiosClient from '../config/axiosClient';
import Login from './Login';

interface User {
  id: string;
  email: string;
  username: string;
  role: string;
  avatar: string;
}

const NavBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSectionsOpen, setIsSectionsOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axiosClient.get('/users/profile', {
            headers: { 'x-auth-token': token },
          });
          setUser(response.data);
        } catch (err) {
          console.error('Error fetching user:', err);
        }
      }
    };

    fetchUser();
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleSectionsMenu = () => {
    setIsSectionsOpen(!isSectionsOpen);
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  const getAvatarUrl = (avatar: string) => {
    const baseURL = axiosClient.defaults.baseURL || '';
    return `${baseURL.replace('/api', '')}${avatar}`;
  };

  return (
    <nav className="bg-white dark:bg-secondary text-tertiary dark:text-white p-4 shadow-md fixed w-full top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img src="/logofdd.png" alt="Logo" className="h-16 w-16" />
          <span className="font-bold text-primary">felipeDiaz.dev</span>
        </div>

        <div className="hidden md:flex space-x-4">
          <Link to="/" className="hover:text-primary">Home</Link>
          <div className="relative">
            <Link to="#" className="hover:text-primary flex items-center" onClick={toggleSectionsMenu}>
              <span>Secciones</span>
              <ChevronDownIcon className="ml-1 h-5 w-5" />
            </Link>
            {isSectionsOpen && (
              <div className="absolute left-0 mt-2 w-48 origin-top-left bg-white dark:bg-secondary text-tertiary dark:text-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <Link to="/skills" className="block px-4 py-2 hover:bg-primary hover:text-white" onClick={toggleSectionsMenu}>Skills</Link>
                <Link to="#certificates" className="block px-4 py-2 hover:bg-primary hover:text-white" onClick={toggleSectionsMenu}>Certificates</Link>
                <Link to="/testimonials" className="block px-4 py-2 hover:bg-primary hover:text-white" onClick={toggleSectionsMenu}>Testimonials</Link>
                <Link to="/projects" className="block px-4 py-2 hover:bg-primary hover:text-white" onClick={toggleSectionsMenu}>Projects</Link>
              </div>
            )}
          </div>
          <Link to="/blogs" className="hover:text-primary">Blog</Link>
          <Link to="/about" className="hover:text-primary">About</Link>
          <Link to="/contact" className="hover:text-primary">Contact</Link>
          {user && user.role === 'admin' && (
            <Link to="/dashboard" className="hover:text-primary flex items-center">
              <CogIcon className="ml-1 h-5 w-5" />
              <span>Dashboard</span>
            </Link>
          )}
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <Menu as="div" className="relative">
              <div className="flex items-center space-x-2 cursor-pointer">
                <Menu.Button className="bg-transparent border-transparent">
                  <img src={getAvatarUrl(user.avatar)} alt="Avatar" className="h-14 w-14 rounded-full border-2 hover:outline-2 border-indigo-500  " />
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white dark:bg-secondary text-tertiary dark:text-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <Link to="/profile" className={`block px-4 py-2 ${active ? 'bg-primary text-white' : ''}`}>
                        Profile
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                  <Link to="/create-blog" className="hover:text-primary block px-4">Create Blog</Link>
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={logout}
                        className={`block w-full text-left px-4 py-2 bg-quaternary ${active ? 'bg-primary text-white' : ''}`}
                      >
                        Logout
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          ) : (
            <button onClick={openLoginModal} className="bg-primary text-white p-2 rounded">Login</button>
          )}
          <ThemeToggle />
        </div>

        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} className="text-primary focus:outline-none">
            {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white dark:bg-secondary">
          <Link to="/" className="block px-4 py-2 hover:bg-primary hover:text-white" onClick={toggleMenu}>Home</Link>

          <div className="relative">
            <Link to="#" className="flex items-center px-4 py-2 hover:bg-primary hover:text-white w-full" onClick={toggleSectionsMenu}>
              <span>Secciones</span>
              <ChevronDownIcon className="ml-2 h-5 w-5" />
            </Link>
            {isSectionsOpen && (
              <div className="bg-white dark:bg-secondary">
                <Link to="/skills" className="block px-4 py-2 hover:bg-primary hover:text-white" onClick={toggleMenu}>Skills</Link>
                <Link to="/certificates" className="block px-4 py-2 hover:bg-primary hover:text-white" onClick={toggleMenu}>Certificates</Link>
                <Link to="/testimonials" className="block px-4 py-2 hover:bg-primary hover:text-white" onClick={toggleMenu}>Testimonials</Link>
                <Link to="/projects" className="block px-4 py-2 hover:bg-primary hover:text-white" onClick={toggleMenu}>Projects</Link>
              </div>
            )}
          </div>

          <Link to="/blogs" className="block px-4 py-2 hover:bg-primary hover:text-white" onClick={toggleMenu}>Blog</Link>
          <Link to="/about" className="block px-4 py-2 hover:bg-primary hover:text-white" onClick={toggleMenu}>About</Link>
          <Link to="/contact" className="block px-4 py-2 hover:bg-primary hover:text-white" onClick={toggleMenu}>Contact</Link>
          {user && user.role === 'admin' && (
            <Link to="/dashboard" className="block px-4 py-2 hover:bg-primary hover:text-white flex items-center" onClick={toggleMenu}>
              <CogIcon className="ml-1 h-5 w-5" />
              <span>Dashboard</span>
            </Link>
          )}
          {user ? (
            <div className="flex items-center space-x-4 px-4 py-2">
              <img src={getAvatarUrl(user.avatar)} alt="Avatar" className="h-8 w-8 rounded-full" />
              <button onClick={logout} className="bg-primary text-white w-full p-2 rounded">Logout</button>
            </div>
          ) : (
            <button onClick={openLoginModal} className="block px-4 py-2 bg-primary text-white w-full">Login</button>
          )}
          <div className="px-4 py-2">
            <ThemeToggle />
          </div>
        </div>
      )}

      {isLoginModalOpen && <Login isModal={true} closeModal={closeLoginModal} />}
    </nav>
  );
};

export default NavBar;
