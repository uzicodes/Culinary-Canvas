'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { CATEGORIES } from './headerCategories'

export function DesktopNav() {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCategoriesOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  return (
    <nav className="hidden md:flex items-center space-x-5 h-full">
      <Link
        href="/all-items"
        className="text-[10px] lg:text-[11px] font-bold text-gray-800 hover:text-black transition-colors uppercase tracking-widest whitespace-nowrap leading-none flex items-center"
      >
        All Items
      </Link>

      <div className="relative flex items-center h-full" ref={dropdownRef}>
        <button
          aria-label="Categories"
          type="button"
          className="text-[10px] lg:text-[11px] font-bold text-gray-800 hover:text-black uppercase tracking-widest focus:outline-none whitespace-nowrap leading-none flex items-center"
          onClick={() => setIsCategoriesOpen((prev) => !prev)}
        >
          Categories
        </button>

        {isCategoriesOpen && (
          <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-64 rounded-2xl shadow-2xl bg-white ring-1 ring-black/5 overflow-hidden py-2 z-50 pointer-events-auto">
            <div>
              {CATEGORIES.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="flex items-center px-4 py-2 text-[10px] font-bold text-gray-700 hover:bg-[#BCE334]/10"
                  onClick={() => setIsCategoriesOpen(false)}
                >
                  <div className="w-5 h-5 relative mr-3">
                    <Image
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>
                  <span>{category.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
