'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Use absolute path for the image
  const logoUrl = '/images/apex-logo.jpg';

  return (
    <header className="bg-white shadow-lg sticky top-0 z-40 border-b border-primary-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-600 rounded-lg p-2 flex items-center justify-center">
                <img
                  src={logoUrl}
                  alt="APEX FINANCIAL HUB"
                  width={60}
                  height={30}
                  className="rounded-md object-cover"
                  onError={(e) => {
                    // Fallback to text if image fails to load
                    e.target.style.display = 'none';
                  }}
                />
                {/* Fallback text logo */}
                <div className="text-white font-bold text-sm leading-tight text-center min-w-[60px] hidden">
                  <div className="text-xs font-extrabold">APEX</div>
                  <div className="text-[10px] font-semibold">FINANCIAL HUB</div>
                </div>
              </div>
              <div className="h-8 w-px bg-primary-200"></div>
              <div className="flex flex-col">
                <div className="text-xl font-bold text-primary-600">TIMVEST</div>
                <div className="text-xs text-gray-500">in partnership</div>
              </div>
            </div>
          </div>

          {/* Rest of the component remains the same */}
          <nav className="hidden md:flex space-x-8">
            <a href="#services" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">Services</a>
            <a href="#pricing" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">Pricing</a>
            <Link href="/admin" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">Admin</Link>
            <a href="tel:+27100300080" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">Call Us</a>
          </nav>

          <button 
            className="md:hidden p-2 rounded-lg hover:bg-primary-50 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="text-2xl text-primary-600">☰</span>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-primary-100">
            <div className="flex flex-col space-y-4">
              <a href="#services" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">Services</a>
              <a href="#pricing" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">Pricing</a>
              <Link href="/admin" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">Admin</Link>
              <a href="tel:+27100300080" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">Call Us</a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}