"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faPhone, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import "@fontsource/anek-malayalam";
import "@fontsource/poppins";

// Enhanced Navbar Component
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navItems = [
    { name: 'About', href: '#about' },
    { name: 'Features', href: '#features' },
    { name: 'Contact', href: '#contact' },
    { name: 'Admission', href: '/admission' },
  ];

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-green-800/90 backdrop-blur-md shadow-lg py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center space-x-3 group transition-transform duration-300 hover:scale-105"
          >
            <div className="relative w-12 h-12 overflow-hidden rounded-xl shadow-lg">
              <Image 
                src="/images/Logo.png"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                alt="Islamic Dawa Academy Logo"
                priority
              />
            </div>
            <span className="text-xl font-bold text-white font-['Poppins'] tracking-wide">
              Islamic Dawa Academy
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-4 py-2 text-white rounded-lg font-['Poppins'] transition-all duration-300 
                  hover:bg-green-700/50 hover:text-green-200 hover:scale-105 
                  active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-green-700/50 transition-all duration-300
              active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
            aria-label="Toggle Menu"
          >
            <div className="w-6 h-6 relative">
              <span className={`absolute h-0.5 w-full bg-white transform transition-all duration-300 ${
                isOpen ? 'rotate-45 top-3' : 'rotate-0 top-1'
              }`} />
              <span className={`absolute h-0.5 w-full bg-white transform transition-all duration-300 top-3 ${
                isOpen ? 'opacity-0' : 'opacity-100'
              }`} />
              <span className={`absolute h-0.5 w-full bg-white transform transition-all duration-300 ${
                isOpen ? '-rotate-45 top-3' : 'rotate-0 top-5'
              }`} />
            </div>
          </button>
        </div>

        <div className={`md:hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100 visible mt-4' : 'max-h-0 opacity-0 invisible mt-0'
        }`}>
          <div className="py-2 space-y-1 backdrop-blur-sm bg-green-800/50 rounded-xl px-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-4 py-3 text-white rounded-lg font-['Poppins'] transition-all duration-300
                  hover:bg-green-700/50 hover:text-green-200 active:scale-95
                  focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Main Home Component
export default function Home() {
  return (
    <div className="bg-gradient-to-b from-green-900 to-green-800 text-white min-h-screen">
      <Navbar />
      
      {/* Original Hero Section */}
      <header className="relative min-h-screen flex items-center justify-center p-10 bg-[url('/images/pattern.png')] bg-cover bg-center">
        <div className="absolute inset-0 bg-green-900/70 backdrop-blur-sm"></div>
        <div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto text-center">
          <Image 
            src="/images/Asset3.png" 
            width={250}
            height={250}
            alt="Hero Image" 
            className="mb-8 hover:scale-105 transition-transform duration-300"
          />
          <h1 className="text-4xl sm:text-6xl font-bold font-malayalam mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-200">
            ഹാഫിളീങ്ങൾക്കായി
          </h1>
          <p className="text-xl sm:text-2xl font-malayalam mb-8">സ്പെഷ്യൽ ഇന്റഗ്രേറ്റഡ് സിലബസ്</p>
          <Link
            href="https://wa.me/919656833399"
            className="group inline-flex items-center bg-green-500 hover:bg-green-400 text-white text-lg font-bold py-4 px-8 rounded-full shadow-xl transition-all hover:-translate-y-1"
          >
            <FontAwesomeIcon icon={faWhatsapp} className="mr-2 text-xl group-hover:scale-110 transition-transform" /> 
            Enroll Now
          </Link>
        </div>
      </header>

      {/* About Section */}
    
    </div>
  );
}
