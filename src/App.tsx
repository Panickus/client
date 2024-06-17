import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import About from './pages/About';
import Footer from './components/Footer';
import Blog from './pages/BlogPage';
import Dashboard from './pages/Dashboard';
import ManageSkills from './components/ManageSkills';
import ManageCertificates from './components/ManageCertificates';
import ManageTestimonials from './components/ManageTestimonials';
import ManageProjects from './components/ManageProjects';
import ManageBlogs from './components/ManageBlogs';
import Profile from './components/Profile';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './components/BlogDetail';
import CreatePost from './components/CreatePost';

const App: React.FC = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/blogs" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogDetailPage />} />
        <Route path="/create-blog" element={<CreatePost />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/manage/skills" element={<ManageSkills />} />
        <Route path="/manage/certificates" element={<ManageCertificates />} />
        <Route path="/manage/testimonials" element={<ManageTestimonials />} />
        <Route path="/manage/projects" element={<ManageProjects />} />
        <Route path="/manage/blogs" element={<ManageBlogs />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
