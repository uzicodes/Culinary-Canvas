'use client'

import { useState, useEffect, useRef } from 'react'
import { ShoppingCart, Menu, X, User } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { MenuItem } from '@/data/menuItems'
import { useAutoLogout } from '@/hooks/useAutoLogout'
import { useSession } from 'next-auth/react'
import { useDataFetch } from '@/hooks/useDataFetch'
import { CATEGORIES } from './header/headerCategories'
import { DesktopNav } from './header/DesktopNav'
import { DesktopSearch } from './header/DesktopSearch'
import { MobileMenu } from './header/MobileMenu'

const Header = () => {
  useAutoLogout()
  const { data: session } = useSession()
  const [searchQuery, setSearchQuery] = useState('')
  const [showResults, setShowResults] = useState(false)
  const inputRef = useRef<HTMLDivElement>(null)
  const mobileInputRef = useRef<HTMLDivElement>(null)

  // 1. Fetch member profile picture using data-fetching layer
  const memberUrl = session?.user?.email ? `/api/members?email=${encodeURIComponent(session.user.email)}` : null
  const { data: memberData } = useDataFetch(memberUrl)
  const displayImage = memberData?.profilePicture || null

  // 2. Fetch live items from your database using data-fetching layer
  const { data: fetchedItems } = useDataFetch('/api/items')
  const dbItems: MenuItem[] = Array.isArray(fetchedItems) ? fetchedItems : []

  // Filter items using live dbItems
  const filteredItems = searchQuery
    ? dbItems.filter((item: MenuItem) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : []

  // Filter categories based on search query
  const filteredCategories = searchQuery
    ? CATEGORIES.filter((category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : []

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const isDesktopInput = inputRef.current?.contains(e.target as Node)
      const isMobileInput = mobileInputRef.current?.contains(e.target as Node)

      if (!isDesktopInput && !isMobileInput) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(() => {
    if (typeof window === 'undefined') return 0
    try {
      const savedTime = localStorage.getItem('cartTimestamp:v1')
      if (savedTime && (Date.now() - parseInt(savedTime, 10)) > 24 * 60 * 60 * 1000) {
        localStorage.removeItem('cart:v1')
        localStorage.removeItem('cartTimestamp:v1')
        return 0
      }
      const saved = localStorage.getItem('cart:v1')
      const cart = saved ? JSON.parse(saved) : []
      return cart.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0)
    } catch {
      return 0
    }
  })

  useEffect(() => {
    const updateCartCount = () => {
      const savedTime = localStorage.getItem('cartTimestamp:v1')
      if (savedTime && (Date.now() - parseInt(savedTime, 10)) > 24 * 60 * 60 * 1000) {
        localStorage.removeItem('cart:v1')
        localStorage.removeItem('cartTimestamp:v1')
        window.dispatchEvent(new Event('storage'))
        window.dispatchEvent(new Event('cartUpdated'))
      }

      const saved = localStorage.getItem('cart:v1')
      const cart = saved ? JSON.parse(saved) : []
      setCartCount(cart.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0))
    }
    window.addEventListener('storage', updateCartCount)
    window.addEventListener('cartUpdated', updateCartCount)
    return () => {
      window.removeEventListener('storage', updateCartCount)
      window.removeEventListener('cartUpdated', updateCartCount)
    }
  }, [])

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
          <DesktopNav />

          <div className="flex items-center space-x-1.5 sm:space-x-3">
            <DesktopSearch
              inputRef={inputRef}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              showResults={showResults}
              setShowResults={setShowResults}
              filteredCategories={filteredCategories}
              filteredItems={filteredItems}
            />

            <Link href="/profile" className="flex items-center justify-center w-7 h-7 text-gray-800 hover:scale-110 transition-transform">
              {displayImage ? (
                <Image 
                  src={displayImage} 
                  alt={session?.user?.name || "Profile"} 
                  width={28}
                  height={28}
                  className="w-full h-full rounded-full object-cover"
                  unoptimized
                  referrerPolicy="no-referrer"
                />
              ) : (
                <User className={`w-4 h-4 ${session ? 'text-black fill-black' : ''}`} />
              )}
            </Link>

            <Link href="/cart" className="relative p-1.5 text-gray-800 hover:scale-110 transition-transform">
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-black text-white text-[8px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              aria-label="Toggle mobile menu"
              type="button"
              className="md:hidden p-1.5 text-gray-800"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        mobileInputRef={mobileInputRef}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showResults={showResults}
        setShowResults={setShowResults}
        filteredCategories={filteredCategories}
        filteredItems={filteredItems}
      />
    </header>
  )
}

export default Header