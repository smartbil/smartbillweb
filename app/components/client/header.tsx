'use client';
import { useAuthStore } from "@/app/store/authStore";
import Link from "next/link";
import { useState } from "react";

const Header = () => {
  const { user } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-primary text-white p-4 relative">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">SMART BILL</h1>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <Link href="home" className="hover:text-gray-300">
            Home
          </Link>
          <Link href="packages" className="hover:text-gray-300">
            Packages
          </Link>
          <Link href="guide" className="hover:text-gray-300">
            Guide
          </Link>
          <Link href="privacy-policy" className="hover:text-gray-300">
            Privacy Policy
          </Link>
          {!user ? (
            <Link href="sign-in" className="hover:text-gray-300">
              Sign in
            </Link>
          ) : (
            <Link href="profile" className="hover:text-gray-300">
              Profile
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden flex flex-col space-y-1 p-2"
          aria-label="Toggle menu"
        >
          <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={closeMenu}>
          <div className="absolute top-0 right-0 h-full w-80 bg-primary shadow-lg transform transition-transform duration-300">
            <div className="flex justify-between items-center p-4 border-b border-white/20">
              <h2 className="text-xl font-bold">Menu</h2>
              <button
                onClick={closeMenu}
                className="p-2"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col p-4 space-y-4">
              <Link 
                href="home" 
                className="py-3 px-4 hover:bg-white/10 rounded-lg transition-colors"
                onClick={closeMenu}
              >
                Home
              </Link>
              <Link 
                href="packages" 
                className="py-3 px-4 hover:bg-white/10 rounded-lg transition-colors"
                onClick={closeMenu}
              >
                Packages
              </Link>
              <Link 
                href="guide" 
                className="py-3 px-4 hover:bg-white/10 rounded-lg transition-colors"
                onClick={closeMenu}
              >
                Guide
              </Link>
              <Link 
                href="privacy-policy" 
                className="py-3 px-4 hover:bg-white/10 rounded-lg transition-colors"
                onClick={closeMenu}
              >
                Privacy Policy
              </Link>
              {!user ? (
                <Link 
                  href="sign-in" 
                  className="py-3 px-4 hover:bg-white/10 rounded-lg transition-colors"
                  onClick={closeMenu}
                >
                  Sign in
                </Link>
              ) : (
                <Link 
                  href="profile" 
                  className="py-3 px-4 hover:bg-white/10 rounded-lg transition-colors"
                  onClick={closeMenu}
                >
                  Profile
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
