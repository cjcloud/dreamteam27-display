'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const Logo = () => (
  <div className="flex items-center gap-2">
    <Image
      src="/images/football27.svg"
      alt="DreamTeam27 Logo"
      width={24}
      height={24}
      className="w-6 h-6 sm:w-7 sm:h-7"
    />
    <span className="text-base sm:text-xl whitespace-nowrap">
      <span className="text-timber font-normal">Dream</span>
      <span className="text-tangerine font-bold">Team</span>
      <span className="text-timber font-bold">27</span>
    </span>
  </div>
);

export default function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="bg-munsell text-white border-b border-black/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12 sm:h-16">
          <Link href="/" aria-label="Home" className="flex items-center" onClick={closeMenu}>
            <Logo />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden sm:flex space-x-4">
            <Link
              href="/teams"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/teams') ? 'bg-black/30 text-tangerine' : 'text-white hover:bg-black/20 hover:text-tangerine'
              }`}
            >
              Teams
            </Link>
            <Link
              href="/league"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/league') ? 'bg-black/30 text-tangerine' : 'text-white hover:bg-black/20 hover:text-tangerine'
              }`}
            >
              League
            </Link>
            <Link
              href="/analysis"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/analysis') ? 'bg-black/30 text-tangerine' : 'text-white hover:bg-black/20 hover:text-tangerine'
              }`}
            >
              Analysis
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={toggleMenu}
            className="sm:hidden flex items-center justify-center w-8 h-8 rounded-md text-timber hover:bg-payne hover:text-white transition-colors"
            aria-label="Toggle navigation menu"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-munsell border-t border-black/20">
              <Link
                href="/teams"
                onClick={closeMenu}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/teams') ? 'bg-black/30 text-tangerine' : 'text-white hover:bg-black/20 hover:text-tangerine'
                }`}
              >
                Teams
              </Link>
              <Link
                href="/league"
                onClick={closeMenu}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/league') ? 'bg-black/30 text-tangerine' : 'text-white hover:bg-black/20 hover:text-tangerine'
                }`}
              >
                League
              </Link>
              <Link
                href="/analysis"
                onClick={closeMenu}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/analysis') ? 'bg-black/30 text-tangerine' : 'text-white hover:bg-black/20 hover:text-tangerine'
                }`}
              >
                Analysis
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
