import React from 'react';
import Skills from '../components/Skills';
import Certificates from '../components/Certificates';
import Testimonials from '../components/Testimonials';
import Projects from '../components/Projects';
import Footer from '../components/Footer';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold">felipeDiaz.dev PortFolio</h1>
          <p className="text-lg mt-4">Presentación de mis habilidades y trabajos.</p>
        </header>
        <section id='Skills'>
          <h2 className="text-2xl font-semibold mb-6">Skills</h2>
          <Skills />
        </section>
        <section id='Certificates'>
          <h2 className="text-2xl font-semibold mt-12 mb-6">Certificates</h2>
          <Certificates />
        </section>
        <section id='Testimonials'>
          <h2 className="text-2xl font-semibold mt-12 mb-6">Testimonials</h2>
          <Testimonials />
        </section>
        <section id='Projects'>
          <h2 className="text-2xl font-semibold mt-12 mb-6">Projects</h2>
          <Projects />
        </section>
      </div>
    </div>
  );
};

export default Home;
