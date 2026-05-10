'use client'

import { useState, useEffect, useRef } from 'react'
import { ShoppingCart, Search, Menu, X, User, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
// Import only the type, not the static data
import { MenuItem } from '@/data/menuItems'
import { useAutoLogout } from '@/hooks/useAutoLogout'
import { useSession } from 'next-auth/react'

const Header = () => {
  useAutoLogout();
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [dbItems, setDbItems] = useState<MenuItem[]>([]); // State for live MongoDB items
  const inputRef = useRef<HTMLInputElement>(null);

  // 1. Fetch live items from your database
  useEffect(() => {
    const fetchLiveItems = async () => {
      try {
        const res = await fetch('/api/items');
        const data = await res.json();
        setDbItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Header search fetch failed:", err);
      }
    };
    fetchLiveItems();
  }, []);

  // 2. Filter using live dbItems instead of static file
  const filteredItems = searchQuery
    ? dbItems.filter((item: MenuItem) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
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

  const categories = [
    { name: 'Burgers', href: '/all-items?category=Burgers', image: 'https://res.cloudinary.com/dihvgsjh5/image/upload/v1768928414/hluwiapjhw5zxmajot0s.png' },
    { name: 'Pizza', href: '/all-items?category=Pizza', image: 'https://res.cloudinary.com/dihvgsjh5/image/upload/v1768931606/jlo1datdnea4q2e2znzf.png' },
    { name: 'Fast-Food', href: '/all-items?category=Fast-Food', image: 'https://res.cloudinary.com/dihvgsjh5/image/upload/v1768930687/m4xqqwl0laegdbrdia5x.png' },
    { name: 'Set Menus', href: '/all-items?category=Set%20Menus', image: 'https://res.cloudinary.com/dihvgsjh5/image/upload/v1768931824/entv9bx7pbaf5w585uq8.png' },
    { name: 'Appetizers', href: '/all-items?category=Appetizers', image: 'https://res.cloudinary.com/dihvgsjh5/image/upload/v1768928874/aeczkqrrzihrjhypcimy.png' },
    { name: 'Chinese', href: '/all-items?category=Chinese', image: 'https://res.cloudinary.com/dihvgsjh5/image/upload/v1768929387/hwz3wnob7an2owpfsmji.png' },
    { name: 'Italian', href: '/all-items?category=Italian', image: 'https://res.cloudinary.com/dihvgsjh5/image/upload/v1768930944/zb7hv5nzgmm2jgynnjnb.png' },
    { name: 'Japanese', href: '/all-items?category=Japanese', image: 'https://res.cloudinary.com/dihvgsjh5/image/upload/v1769263611/culinary-canvas/items/spzco8tvg4e7dbsippj7.png' },
    { name: 'Traditional', href: '/all-items?category=Traditional', image: 'https://res.cloudinary.com/dihvgsjh5/image/upload/v1768932168/ui6fxgadb6qiokz4pd4s.png' },
    { name: 'Sea-Food', href: '/all-items?category=Sea-Food', image: 'https://res.cloudinary.com/dihvgsjh5/image/upload/v1769258267/culinary-canvas/items/up4eyut0dnuqo7tuaztu.png' },
    { name: 'Pakistani', href: '/all-items?category=Pakistani', image: 'https://res.cloudinary.com/dihvgsjh5/image/upload/v1768931301/w4swf1srbxfriq36jmr5.png' },
    { name: 'Coffee', href: '/all-items?category=Coffee', image: 'https://res.cloudinary.com/dihvgsjh5/image/upload/v1768929560/gr11cmbnyis9am6wza75.png' },
    { name: 'Desserts', href: '/all-items?category=Desserts', image: 'https://res.cloudinary.com/dihvgsjh5/image/upload/v1768929707/e1mb19v21fygi4g0q7ri.png' },
    { name: 'Drinks & Beverages', href: '/all-items?category=Drinks%20%26%20Beverages', image: 'https://res.cloudinary.com/dihvgsjh5/image/upload/v1768930469/gd9vgbakrt0mmuv5ao4s.png' },
  ];

  // 3. Filter categories based on search query
  const filteredCategories = searchQuery
    ? categories.filter((category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : [];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const updateCartCount = () => {
        const savedTime = localStorage.getItem('cartTimestamp');
        if (savedTime && (Date.now() - parseInt(savedTime, 10)) > 24 * 60 * 60 * 1000) {
          localStorage.removeItem('cart');
          localStorage.removeItem('cartTimestamp');
          window.dispatchEvent(new Event('storage'));
          window.dispatchEvent(new Event('cartUpdated'));
        }

        const saved = localStorage.getItem('cart');
        const cart = saved ? JSON.parse(saved) : [];
        setCartCount(cart.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0));
      };
      updateCartCount();
      window.addEventListener('storage', updateCartCount);
      window.addEventListener('cartUpdated', updateCartCount);
      return () => {
        window.removeEventListener('storage', updateCartCount);
        window.removeEventListener('cartUpdated', updateCartCount);
      };
    }
  }, []);

  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <div
        className="w-full max-w-4xl h-14 rounded-full flex items-center justify-between px-6 pointer-events-auto transition-all duration-300 shadow-xl border border-white/20"
        style={{
          backgroundColor: '#BCE334',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div className="flex items-center shrink-0">
          <Link href="/" className="flex items-center space-x-2 -ml-2">
            <div className="w-12 h-12 relative">
              <Image src="/without_BG_logo.png" alt="Logo" fill className="object-contain" sizes="48px" />
            </div>
            <span
              className="text-base sm:text-lg lg:text-2xl font-white text-grey-500 tracking-tighter uppercase leading-none"
              style={{ fontFamily: 'Nalinak, Inter, sans-serif' }}
            >
              Culinary Canvas
            </span>
          </Link>
        </div>

        <div className="flex items-center space-x-4 lg:space-x-6">
          <nav className="hidden md:flex items-center space-x-5 h-full">
            <Link
              href="/all-items"
              className="text-[10px] lg:text-[11px] font-bold text-gray-800 hover:text-black transition-colors uppercase tracking-widest whitespace-nowrap leading-none flex items-center"
            >
              All Items
            </Link>

            <div className="relative flex items-center h-full">
              <button
                type="button"
                className="text-[10px] lg:text-[11px] font-bold text-gray-800 hover:text-black uppercase tracking-widest focus:outline-none whitespace-nowrap leading-none flex items-center"
                onClick={() => setIsCategoriesOpen((prev) => !prev)}
              >
                Categories
              </button>

              {isCategoriesOpen && (
                <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-64 rounded-2xl shadow-2xl bg-white ring-1 ring-black/5 overflow-hidden py-2 z-50 pointer-events-auto">
                  <div>
                    {categories.map((category) => (
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

          <div className="flex items-center space-x-1.5 sm:space-x-3">
            <div className="relative hidden sm:block w-28 lg:w-40 group" ref={inputRef}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery) window.location.href = `/all-items?search=${encodeURIComponent(searchQuery)}`;
                }}
              >
                <input
                  type="text"
                  placeholder="Search..."
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
                          <div className="w-8 h-8 relative shrink-0"><Image src={category.image} alt={category.name} fill className="object-cover rounded-full" /></div>
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
                          <div className="w-8 h-8 relative shrink-0"><Image src={item.image} alt={item.name} fill className="object-cover rounded-md" /></div>
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

            <Link href="/profile" className="p-1.5 text-gray-800 hover:scale-110 transition-transform">
              <User className={`w-4 h-4 ${session ? 'text-black fill-black' : ''}`} />
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-20 left-4 right-4 bg-white rounded-3xl shadow-2xl p-6 pointer-events-auto md:hidden flex flex-col gap-4 border border-gray-100 ring-1 ring-black/5">
          <div className="relative w-full">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery) {
                  window.location.href = `/all-items?search=${encodeURIComponent(searchQuery)}`;
                  setIsMobileMenuOpen(false);
                }
              }}
            >
              <input
                type="text"
                placeholder="Search food..."
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setShowResults(true); }}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-[#BCE334] text-sm font-medium transition-all placeholder:text-gray-400"
                autoComplete="off"
              />
            </form>
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>

          <div className="space-y-2">
            <Link href="/all-items" className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 font-bold text-gray-800" onClick={() => setIsMobileMenuOpen(false)}>
              <span>All Items</span>
            </Link>

            <div className="rounded-xl overflow-hidden bg-white border border-gray-100">
              <button
                onClick={() => setIsMobileCategoriesOpen(!isMobileCategoriesOpen)}
                className="w-full flex items-center justify-between p-3 hover:bg-gray-50 font-bold text-gray-800"
              >
                <span>Categories</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isMobileCategoriesOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMobileCategoriesOpen && (
                <div className="bg-gray-50/50 p-2 grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <Link key={category.name} href={category.href} className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-[10px] font-bold text-gray-700 hover:bg-white hover:shadow-sm transition-all" onClick={() => setIsMobileMenuOpen(false)}>
                      <div className="w-5 h-5 relative shrink-0"><Image src={category.image} alt={category.name} fill className="object-cover rounded-full" /></div>
                      <span className="truncate">{category.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header