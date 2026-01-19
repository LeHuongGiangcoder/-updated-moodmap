'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

import { Menu, X } from 'lucide-react';

const NavigationBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <nav className={`w-full px-6 md:px-8 py-4 flex justify-between items-center text-white fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${scrolled ? 'bg-black/90 backdrop-blur-md' : 'bg-transparent'}`}>
      <div className="logo z-50 relative">
        <Link href="/" className="logo-font text-2xl" onClick={() => setIsMobileMenuOpen(false)}>Moodmap</Link>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-8">
        <Link href="/" className="navbartext">Home</Link>
        <Link href="/library" className="navbartext">Library</Link>
        <Link href="/pricing" className="navbartext">Pricing</Link>
        <Link href="/blog" className="navbartext">Blog</Link>
      </div>
      <div className="hidden md:flex items-center space-x-4">
        <Link href="/login" className="navbartext">Log In</Link>
        <Link href="/signup" className="btn-tertiary">Sign Up</Link>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden z-50 relative">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white focus:outline-none p-2"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black z-40 flex flex-col justify-center items-center space-y-8 animate-in fade-in slide-in-from-top-10 duration-200">
          <Link href="/" className="text-2xl font-bold text-white hover:text-[var(--primary-green)] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link href="/library" className="text-2xl font-bold text-white hover:text-[var(--primary-green)] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Library</Link>
          <Link href="/pricing" className="text-2xl font-bold text-white hover:text-[var(--primary-green)] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Pricing</Link>
          <Link href="/blog" className="text-2xl font-bold text-white hover:text-[var(--primary-green)] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Blog</Link>
          <div className="w-16 h-[1px] bg-zinc-800 my-4"></div>
          <Link href="/login" className="text-xl text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>Log In</Link>
          <Link href="/signup" className="btn-tertiary text-xl px-8 py-3" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
        </div>
      )}
    </nav>
  );
};

export default NavigationBar;
