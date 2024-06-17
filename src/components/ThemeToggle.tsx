import React, { useEffect, useState } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 focus:outline-none bg-transparent" // Eliminamos las clases de fondo
    >
      {theme === 'dark' ? (
        <SunIcon className="h-6 w-6 text-yellow-500" /> // Ajustamos el tamaño de los íconos
      ) : (
        <MoonIcon className="h-6 w-6 text-primary" />
      )}
    </button>
  );
};

export default ThemeToggle;
