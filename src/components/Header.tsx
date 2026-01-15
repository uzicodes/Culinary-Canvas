'use client'

import { useState, useEffect, useRef } from 'react'
import { ShoppingCart, Search, Menu, X, User } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import menuItems, { MenuItem } from '@/data/menuItems'
import { useAutoLogout } from '@/hooks/useAutoLogout'

const Header = () => {
  // --- PRESERVED LOGIC ---
  useAutoLogout();
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredItems = searchQuery
    ? menuItems.filter((item: MenuItem) =>
        item.name.toLowerCase().startsWith(searchQuery.toLowerCase())
      )
    : [];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const updateCartCount = () => {
        const saved = localStorage.getItem('cart');
        const cart = saved ? JSON.parse(saved) : [];
        setCartCount(cart.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0));
      };
      updateCartCount();
      window.addEventListener('storage', updateCartCount);
      return () => window.removeEventListener('storage', updateCartCount);
    }
  }, []);

  return (
    // Outer container handles centering and top spacing
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <div 
        className="w-full max-w-4xl h-14 rounded-full flex items-center justify-between px-6 pointer-events-auto transition-all duration-300 shadow-xl border border-white/20"
        style={{ 
            backgroundColor: '#E7CCF0',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' 
        }}
      >
        {/* LEFT: Logo Section */}
        <div className="flex items-center shrink-0">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 relative">
              <Image src="/without_BG_logo.png" alt="Logo" fill className="object-contain" />
            </div>
            <span className="hidden lg:block text-xs font-black text-gray-900 tracking-tighter uppercase">
              Culinary Canvas
            </span>
          </Link>
        </div>

        {/* RIGHT: Combined Nav and Actions */}
        <div className="flex items-center space-x-4 lg:space-x-6">
          
          {/* Navigation Links - Grouped close to the right */}
          <nav className="hidden md:flex items-center space-x-5">
            <Link href="/all-items" className="text-[10px] lg:text-[11px] font-bold text-gray-800 hover:text-black transition-colors uppercase tracking-widest whitespace-nowrap">
              All Items
            </Link>
            
            <div className="relative">
              <button
                type="button"
                className="text-[10px] lg:text-[11px] font-bold text-gray-800 hover:text-black uppercase tracking-widest focus:outline-none whitespace-nowrap"
                onClick={() => setIsCategoriesOpen((prev) => !prev)}
              >
                Categories
              </button>
              {isCategoriesOpen && (
                <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-64 rounded-2xl shadow-2xl bg-white ring-1 ring-black/5 overflow-hidden py-2 z-50">
                  <div className="max-h-[60vh] overflow-y-auto">
                      {[
                          { name: 'Burgers', href: '/all-items?category=burger', image: '/items/burger/classic.png' },
                          { name: 'Pizza', href: '/all-items?category=pizza', image: '/items/pizza/margherita.png' },
                          { name: 'Fast-Food', href: '/all-items?category=fastfood', image: '/items/fastfood/fried_chicken.png' },
                          { name: 'Set Menus', href: '/all-items?category=setmenu', image: '/items/setmenu/1.png' },
                          { name: 'Appetizers', href: '/all-items?category=appetizers', image: '/items/appetizers/spring_rolls.png' },
                          { name: 'Chinese', href: '/all-items?category=chinese', image: '/items/chinese/kung_pao.png' },
                          { name: 'Italian', href: '/all-items?category=italian', image: '/items/italian/alfredo.png' },
                          { name: 'Traditional', href: '/all-items?category=traditional', image: '/items/traditional/biryani.png' },
                          { name: 'Pakistani', href: '/all-items?category=pakistani', image: '/items/pakistani/karahi.png' },
                          { name: 'Coffee', href: '/all-items?category=coffee', image: '/items/coffee/espresso.png' },
                          { name: 'Desserts', href: '/all-items?category=desserts', image: '/items/desserts/croissant.png' },
                          { name: 'Drinks & Beverages', href: '/all-items?category=drinks', image: '/items/drinks/coke.png' },
                      ].map((category) => (
                          <Link key={category.name} href={category.href} className="flex items-center px-4 py-2 text-[10px] font-bold text-gray-700 hover:bg-[#BCE334]/10" onClick={() => setIsCategoriesOpen(false)}>
                              <div className="w-5 h-5 relative mr-3"><Image src={category.image} alt={category.name} fill className="object-cover rounded-full" /></div>
                              <span>{category.name}</span>
                          </Link>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Search, User, Cart Icons */}
          <div className="flex items-center space-x-1.5 sm:space-x-3">
            <div className="relative hidden sm:block w-28 lg:w-40 group" ref={inputRef}>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setShowResults(true); }}
                className="w-full pl-7 pr-3 py-1 rounded-full border-none bg-black/5 focus:bg-white/40 focus:ring-1 focus:ring-black/20 text-[10px] transition-all placeholder:text-gray-600"
                onFocus={() => setShowResults(true)}
              />
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-700" />
              
              {showResults && searchQuery && (
                <div className="absolute top-full mt-4 right-0 w-64 bg-white border rounded-2xl shadow-2xl overflow-hidden py-1 z-50">
                  {filteredItems.length > 0 ? (
                    filteredItems.map(item => (
                      <Link href={`/all-items/${item.id}`} key={item.id} className="flex items-center gap-3 px-3 py-2 hover:bg-[#BCE334]/20" onClick={() => setShowResults(false)}>
                        <div className="w-8 h-8 relative"><Image src={item.image} alt={item.name} fill className="object-cover rounded-md" /></div>
                        <div className="text-[10px] font-bold text-gray-900">{item.name}</div>
                      </Link>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-[10px] text-gray-500">No results found</div>
                  )}
                </div>
              )}
            </div>

            <Link href="/profile" className="p-1.5 text-gray-800 hover:scale-110 transition-transform">
              <User className="w-4 h-4" />
            </Link>

            <Link href="/cart" className="relative p-1.5 text-gray-800 hover:scale-110 transition-transform">
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-black text-white text-[8px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <button className="md:hidden p-1.5 text-gray-800" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header