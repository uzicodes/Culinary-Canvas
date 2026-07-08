'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, ChevronDown } from 'lucide-react'
import { CATEGORIES, HeaderCategory } from './headerCategories'
import { MenuItem } from '@/data/menuItems'

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  mobileInputRef: React.RefObject<HTMLDivElement> | any;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showResults: boolean;
  setShowResults: (show: boolean) => void;
  filteredCategories: HeaderCategory[];
  filteredItems: MenuItem[];
}

export function MobileMenu({
  isOpen,
  onClose,
  mobileInputRef,
  searchQuery,
  setSearchQuery,
  showResults,
  setShowResults,
  filteredCategories,
  filteredItems,
}: MobileMenuProps) {
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="absolute top-20 left-4 right-4 bg-white rounded-3xl shadow-2xl p-6 pointer-events-auto md:hidden flex flex-col gap-4 border border-gray-100 ring-1 ring-black/5 z-40">
      <div className="relative w-full" ref={mobileInputRef}>
        <form
          action={() => {
            if (searchQuery) {
              window.location.href = `/all-items?search=${encodeURIComponent(searchQuery)}`;
              onClose();
            }
          }}
        >
          <input
            id="mobile-search-input"
            type="text"
            placeholder="Search food..."
            aria-label="Search food"
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setShowResults(true); }}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-[#BCE334] text-sm font-medium transition-all placeholder:text-gray-400"
            autoComplete="off"
          />
        </form>
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

        {showResults && searchQuery && (
          <div className="fixed top-48 left-4 right-4 bg-white border rounded-2xl shadow-2xl overflow-hidden py-1 z-50 max-h-64 overflow-y-auto">
            {filteredCategories.length > 0 && (
              <>
                <div className="px-3 py-2 text-[9px] font-bold text-gray-500 uppercase tracking-widest bg-gray-50">Categories</div>
                {filteredCategories.map(category => (
                  <Link
                    href={category.href}
                    key={category.name}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-[#BCE334]/20"
                    onClick={() => { setShowResults(false); onClose(); }}
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
                    onClick={() => { setShowResults(false); onClose(); }}
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

      {!showResults && (
        <>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            <Link href="/all-items" className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 font-bold text-gray-800" onClick={onClose}>
              <span>All Items</span>
            </Link>

            <div className="rounded-xl overflow-hidden bg-white border border-gray-100">
              <button
                aria-label="Categories"
                type="button"
                onClick={() => setIsMobileCategoriesOpen(!isMobileCategoriesOpen)}
                className="w-full flex items-center justify-between p-3 hover:bg-gray-50 font-bold text-gray-800"
              >
                <span>Categories</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isMobileCategoriesOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMobileCategoriesOpen && (
                <div className="bg-gray-50/50 p-2 grid grid-cols-2 gap-2">
                  {CATEGORIES.map((category) => (
                    <Link key={category.name} href={category.href} className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-[10px] font-bold text-gray-700 hover:bg-white hover:shadow-sm transition-all" onClick={onClose}>
                      <div className="w-5 h-5 relative shrink-0">
                        <Image sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" src={category.image} alt={category.name} fill className="object-cover rounded-full" />
                      </div>
                      <span className="truncate">{category.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
