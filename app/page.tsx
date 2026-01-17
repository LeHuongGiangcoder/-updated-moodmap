'use client';

import NavigationBar from './components/NavigationBar';
import Link from 'next/link';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { GooeyText } from '@/components/ui/gooey-text-morphing';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import Carousel from './components/Carousel';

export default function Home() {
  return (
    <div className="relative bg-black">
      <NavigationBar/>
      <main>
        {/* Hero Section */}
        <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
          {/* Video Background */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-80"
          >
            <source src="/assets/hero-background.mp4" type="video/mp4" />
          </video>

          {/* Overlays */}
          <div className="absolute inset-0 bg-black/50 z-0 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] z-0 pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 p-8 pt-20 w-full">
            <div className="text-center text-white w-full max-w-4xl mx-auto">
            <div className="h-[80px] md:h-[110px] flex items-center justify-center mb-2">
              <GooeyText
                texts={["Map your journies", "Tell your stories"]}
                morphTime={0.6}
                cooldownTime={1.5}
                className="font-bold"
                textClassName="text-white text-4xl md:text-7xl whitespace-nowrap font-['Geomanist'] tracking-tight"
              />
            </div>
            <p className="text-normal md:text-xl opacity-90 font-light tracking-wide max-w-2xl mx-auto">
                Create and share beautiful maps of your life&apos;s moments.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link href="/library" className="btn-primary">Get started</Link>
              <Link href="#features" className="btn-tertiary">Learn more</Link>
            </div>
          </div>
        </div>
        </div>

        {/* Features Section */}
        <section id="features" className="bg-black py-24">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white">Why Moodmap?</h2>
              <p className="text-gray-400 mt-2">All the tools you need to beautifully document your travels.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="relative bg-zinc-900 p-8 rounded-lg flex flex-col justify-between transition-colors hover:bg-zinc-800 min-h-[300px]">
                <GlowingEffect disabled={false} glow={true} />
                <h3 className="relative z-10 text-3xl font-bold text-white leading-tight">Interactive<br/>Mapping</h3>
                <p className="relative z-10 text-gray-400">
                  Add locations, draw routes, and customize your map. Your journey, your style.
                </p>
              </div>
              <div className="relative bg-zinc-900 p-8 rounded-lg flex flex-col justify-between transition-colors hover:bg-zinc-800 min-h-[300px]">
                <GlowingEffect disabled={false} glow={true} />
                <h3 className="relative z-10 text-3xl font-bold text-white leading-tight">Rich Journaling</h3>
                <p className="relative z-10 text-gray-400">
                  Bring your memories to life with photos, videos, and rich text entries for every step of the way.
                </p>
              </div>
              <div className="relative bg-zinc-900 p-8 rounded-lg flex flex-col justify-between transition-colors hover:bg-zinc-800 min-h-[300px]">
                <GlowingEffect disabled={false} glow={true} />
                <h3 className="relative z-10 text-3xl font-bold text-white leading-tight">Community &<br/>Sharing</h3>
                <p className="relative z-10 text-gray-400">
                  Share your adventures with friends, family, and community. Inspire and be inspired.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Guiding Section */}
        <section id="guiding" className="bg-white py-24">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-black">Start Your Journey</h2>
              <p className="text-gray-600 mt-2">A step-by-step guide to your first Moodmap adventure.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
              {/* Left Column */}
              <div>
                <Carousel images={['/assets/guiding-pic-1.JPG', '/assets/guiding-pic-2.JPG', '/assets/guiding-pic-2.png']} />
                <h3 className="text-3xl font-bold text-black mb-4 mt-6">Create Your First Map</h3>
                <a href="#" className="text-black font-semibold flex items-center group">
                  Read More
                  <span className="ml-2 rounded-full w-6 h-6 flex items-center justify-center transition-transform group-hover:translate-x-1" style={{ backgroundColor: 'var(--primary-green)', color: 'black' }}>→</span>
                </a>
              </div>

              {/* Right Column */}
              <div className="flex flex-col space-y-8 mt-12 md:mt-0">
                <h4 className="text-2xl font-bold text-black">Build Your Trip Library</h4>
                <hr className="border-gray-300"/>
                <h4 className="text-2xl font-bold text-black">Journal Your Adventures</h4>
                <hr className="border-gray-300"/>
                <h4 className="text-2xl font-bold text-black">Share with the Community</h4>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-between items-start">
            {/* Left Side: Logo and Social Icons */}
            <div className="w-full md:w-1/4 mb-8 md:mb-0">
              <h3 className="logo-font text-4xl mb-6">Moodmap</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white"><FaFacebook size={24} /></a>
                <a href="#" className="text-gray-400 hover:text-white"><FaTwitter size={24} /></a>
                <a href="#" className="text-gray-400 hover:text-white"><FaInstagram size={24} /></a>
                <a href="#" className="text-gray-400 hover:text-white"><FaLinkedin size={24} /></a>
                <a href="#" className="text-gray-400 hover:text-white"><FaYoutube size={24} /></a>
              </div>
            </div>

            {/* Right Side: Links */}
            <div className="w-full md:w-3/4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                <div>
                  <h4 className="font-bold mb-4">Product</h4>
                  <ul className="space-y-2">
                    <li><a href="#features" className="navbartext">Features</a></li>
                    <li><a href="/pricing" className="navbartext">Pricing</a></li>
                    <li><a href="/community" className="navbartext">Community</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-4">Company</h4>
                  <ul className="space-y-2">
                    <li><a href="/about" className="navbartext">About Us</a></li>
                    <li><a href="/blog" className="navbartext">Blog</a></li>
                    <li><a href="/contact" className="navbartext">Contact</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-4">Resources</h4>
                  <ul className="space-y-2">
                    <li><a href="/support" className="navbartext">Support</a></li>
                    <li><a href="/privacy" className="navbartext">Privacy Policy</a></li>
                    <li><a href="/terms" className="navbartext">Terms of Service</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} Moodmap. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
