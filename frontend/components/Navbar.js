import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <img src="/logo.svg" alt="AutoClip Logo" className="w-8 h-8" />
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              AutoClip
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-indigo-600 transition-colors">
              Home
            </Link>
            <Link href="/app" className="text-gray-700 hover:text-indigo-600 transition-colors">
              App
            </Link>
            <Link href="/pricing" className="text-gray-700 hover:text-indigo-600 transition-colors">
              Pricing
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-indigo-600 transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-indigo-600 transition-colors">
              Contact
            </Link>
            <Link 
              href="/app" 
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-indigo-600 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div 
            className="md:hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-100">
              <Link href="/" className="block px-3 py-2 text-gray-700 hover:text-indigo-600 transition-colors">
                Home
              </Link>
              <Link href="/app" className="block px-3 py-2 text-gray-700 hover:text-indigo-600 transition-colors">
                App
              </Link>
              <Link href="/pricing" className="block px-3 py-2 text-gray-700 hover:text-indigo-600 transition-colors">
                Pricing
              </Link>
              <Link href="/about" className="block px-3 py-2 text-gray-700 hover:text-indigo-600 transition-colors">
                About
              </Link>
              <Link href="/contact" className="block px-3 py-2 text-gray-700 hover:text-indigo-600 transition-colors">
                Contact
              </Link>
              <Link 
                href="/app" 
                className="block mx-3 mt-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg text-center hover:opacity-90 transition-opacity"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}

