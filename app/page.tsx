'use client';

import NavigationBar from './components/NavigationBar';
import Link from 'next/link';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { GooeyText } from '@/components/ui/gooey-text-morphing';
import AnimatedShaderBackground from '@/components/ui/animated-shader-background';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaPlay, FaArrowRight } from 'react-icons/fa';
import Globe3D from './components/Globe3D';

export default function Home() {
  return (
    <div className="relative bg-black">
      <NavigationBar />
      <main>
        {/* Hero Section */}
        <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
          <AnimatedShaderBackground className="flex flex-col items-center justify-center">
            {/* Background Gradient Mesh */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] bg-[var(--primary-pink)] rounded-full opacity-10 blur-[120px]" />
              <div className="absolute bottom-[-10%] right-[20%] w-[400px] h-[400px] bg-[var(--primary-green)] rounded-full opacity-10 blur-[100px]" />
            </div>

            {/* Content */}
            <div className="relative z-10 p-8 pt-20 w-full">
              <div className="text-center text-white w-full max-w-5xl mx-auto flex flex-col items-center">

                {/* Headline */}
                <div className="h-[120px] md:h-[180px] flex items-center justify-center mb-6 w-full">
                  <GooeyText
                    texts={["Map your journeys", "Tell your stories"]}
                    morphTime={0.6}
                    cooldownTime={2.5}
                    className="font-bold w-full"
                    textClassName="text-white text-4xl md:text-6xl whitespace-nowrap font-['Geomanist'] tracking-tight font-bold leading-tight"
                  />
                </div>

                {/* Subheadline */}
                <p className="text-lg md:text-xl text-gray-400 font-light tracking-wide max-w-2xl mx-auto mb-10 leading-relaxed">
                  Create and share beautiful maps of your life&apos;s moments.
                  <br className="hidden md:block" />
                  Visualize your memories in a map designed for explorers.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Link href="/library" className="btn-primary group">
                    Start Mapping
                    <FaArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link href="#demo" className="btn-secondary group">
                    <FaPlay className="mr-2 w-3 h-3" />
                    Watch Demo
                  </Link>
                </div>

              </div>
            </div>
          </AnimatedShaderBackground>
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
                <h3 className="relative z-10 text-3xl font-bold text-white leading-tight">Interactive<br />Mapping</h3>
                <p className="relative z-10 text-gray-400">
                  Add locations, draw routes, and customize your map. Your journey, your style.
                </p>
              </div>
              <div className="relative bg-zinc-900 p-8 rounded-lg flex flex-col justify-between transition-colors hover:bg-zinc-800 min-h-[300px]">
                <GlowingEffect disabled={false} glow={true} />
                <h3 className="relative z-10 text-3xl font-bold text-white leading-tight">Rich Journaling</h3>
                <p className="relative z-10 text-gray-400">
                  Bring your memories to life with rich text entries for every step of the way.
                </p>
              </div>
              <div className="relative bg-zinc-900 p-8 rounded-lg flex flex-col justify-between transition-colors hover:bg-zinc-800 min-h-[300px]">
                <GlowingEffect disabled={false} glow={true} />
                <h3 className="relative z-10 text-3xl font-bold text-white leading-tight">Community &<br />Sharing</h3>
                <p className="relative z-10 text-gray-400">
                  Share your adventures with friends, family, and community. Inspire and be inspired.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Guiding Section */}
        <section id="guiding" className="bg-black py-32 relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[var(--primary-pink)]/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Start Your Journey</h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">A step-by-step guide to documenting your adventures with Moodmap.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left Column - Visuals */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary-green)] to-[var(--primary-pink)] rounded-2xl blur-xl opacity-20" />
                <div className="relative">
                  <Globe3D />
                </div>
              </div>

              {/* Right Column - Steps */}
              <div className="flex flex-col space-y-6">

                {/* Step 1 */}
                <div className="group p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800 hover:border-[var(--primary-green)] hover:bg-zinc-900/50 transition-all duration-300">
                  <div className="flex items-start gap-5">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[var(--primary-green)]/10 border border-[var(--primary-green)]/20 flex items-center justify-center text-[var(--primary-green)] font-bold text-lg group-hover:scale-110 transition-transform">1</div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2 group-hover:text-[var(--primary-green)] transition-colors">Build Your Trip Library</h4>
                      <p className="text-gray-400 leading-relaxed">Start by creating a trip. Add details like location, duration, and cover photos to organize your past and future travels.</p>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="group p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800 hover:border-[var(--primary-pink)] hover:bg-zinc-900/50 transition-all duration-300">
                  <div className="flex items-start gap-5">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[var(--primary-pink)]/10 border border-[var(--primary-pink)]/20 flex items-center justify-center text-[var(--primary-pink)] font-bold text-lg group-hover:scale-110 transition-transform">2</div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2 group-hover:text-[var(--primary-pink)] transition-colors">Journal Your Adventures</h4>
                      <p className="text-gray-400 leading-relaxed">Document every moment. Add rich text entries, photos, and pin locations on the interactive map to tell your story.</p>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="group p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800 hover:border-white hover:bg-zinc-900/50 transition-all duration-300">
                  <div className="flex items-start gap-5">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">3</div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2 group-hover:text-white transition-colors">Share with the Community</h4>
                      <p className="text-gray-400 leading-relaxed">Publish your maps to the community or keep them private. Inspire others and discover new destinations.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 pl-4">
                  <Link href="/library" className="btn-tertiary group inline-flex items-center">
                    Start Your First Map
                    <FaArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>

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
