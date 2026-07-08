'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search } from 'lucide-react'
import { HeaderCategory } from './headerCategories'
import { MenuItem } from '@/data/menuItems'

interface DesktopSearchProps {
  inputRef: React.RefObject<HTMLDivElement> | any;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showResults: boolean;
  setShowResults: (show: boolean) => void;
  filteredCategories: HeaderCategory[];
  filteredItems: MenuItem[];
}

export function DesktopSearch({
  inputRef,
  searchQuery,
  setSearchQuery,
  showResults,
  setShowResults,
  filteredCategories,
  filteredItems,
}: DesktopSearchProps) {
  return (
    <div className="relative hidden sm:block w-28 lg:w-40 group" ref={inputRef}>
      <form
        action={() => {
          if (searchQuery) window.location.href = `/all-items?search=${encodeURIComponent(searchQuery)}`;
        }}
      >
        <input
          id="desktop-search-input"
          type="text"
          placeholder="Search..."
          aria-label="Search items"
          value={searchQuery}
          onChange={e => { setSearchQuery(e.target.value); setShowResults(true); }}
          className="w-full pl-7 pr-3 py-1 rounded-full border-none bg-black/5 focus:bg-white/40 focus:ring-1 focus:ring-black/20 text-[10px] transition-all placeholder:text-gray-600"
          onFocus={() => setShowResults(true)}
          autoComplete="off"
        />
      </form>
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-700" />

      {showResults && searchQuery && (
        <div className="absolute top-full mt-4 right-0 w-64 bg-white border rounded-2xl shadow-2xl overflow-hidden py-1 z-50 max-h-96 overflow-y-auto">
          {filteredCategories.length > 0 && (
            <>
              <div className="px-3 py-2 text-[9px] font-bold text-gray-500 uppercase tracking-widest bg-gray-50">Categories</div>
              {filteredCategories.map(category => (
                <Link
                  href={category.href}
                  key={category.name}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-[#BCE334]/20"
                  onClick={() => setShowResults(false)}
                >
                  <div className="w-8 h-8 relative shrink-0">
                    <Image sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" src={category.image} alt={category.name} fill className="object-cover rounded-full" />
                  </div>
                  <div className="text-[10px] font-bold text-gray-900 truncate">{category.name}</div>
                </Link>
              ))}
            </>
          )}

          {filteredItems.length > 0 && (
            <>
              {filteredCategories.length > 0 && <div className="h-px bg-gray-200" />}
              <div className="px-3 py-2 text-[9px] font-bold text-gray-500 uppercase tracking-widest bg-gray-50">Items</div>
              {filteredItems.map(item => (
                <Link
                  href={`/all-items?search=${encodeURIComponent(item.name)}`}
                  key={item._id || (item as any).id}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-[#BCE334]/20"
                  onClick={() => setShowResults(false)}
                >
                  <div className="w-8 h-8 relative shrink-0">
                    <Image sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" src={item.image} alt={item.name} fill className="object-cover rounded-md" />
                  </div>
                  <div className="text-[10px] font-bold text-gray-900 truncate">{item.name}</div>
                </Link>
              ))}
            </>
          )}

          {filteredCategories.length === 0 && filteredItems.length === 0 && (
            <div className="px-4 py-3 text-[10px] text-gray-500">No results found</div>
          )}
        </div>
      )}
    </div>
  );
}
