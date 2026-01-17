'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const NavigationBar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`w-full px-8 py-4 flex justify-between items-center text-white fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${scrolled ? 'bg-black/50' : 'bg-transparent'}`}>
      <div className="logo">
        <Link href="/" className="logo-font">Moodmap</Link>
      </div>
      <div className="flex items-center space-x-6">
        <Link href="/" className="navbartext">Home</Link>
        <Link href="/library" className="navbartext">Library</Link>
        <Link href="/pricing" className="navbartext">Pricing</Link>
        <Link href="/blog" className="navbartext">Blog</Link>
      </div>
      <div className="flex items-center space-x-4">
        <Link href="/login" className="navbartext">Log In</Link>
        <Link href="/signup" className="btn-tertiary">Sign Up</Link>
      </div>
    </nav>
  );
};

export default NavigationBar;
