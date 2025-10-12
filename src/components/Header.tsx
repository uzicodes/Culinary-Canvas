'use client'

import { useState } from 'react'
import { ShoppingCart, Search, Menu, X, User, Heart } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const Header = () => {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
  <header className="shadow-sm sticky top-0 z-50" style={{ backgroundColor: '#FCCA46' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 relative">
                <Image
                  src="/without_BG_logo.png"
                  alt="Culinary Canvas Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold text-gray-900">Culinary Canvas</span>
            </Link>
          </div>




          {/* Right Side Actions with Search and Nav Links */}
          <div className="flex items-center space-x-4">
            {/* Nav Links left of Search */}
            <nav className="hidden md:flex items-center space-x-8 relative">
              <Link href="/all-items" className="text-gray-700 hover:text-primary-600 font-medium">
                All Items
              </Link>
              <div className="relative">
                <button
                  type="button"
                  className="text-gray-700 hover:text-primary-600 font-medium focus:outline-none"
                  onClick={() => setIsCategoriesOpen((prev) => !prev)}
                >
                  Categories
                </button>
                {isCategoriesOpen && (
                  <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      <Link href="/all-items" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">All Items</Link>
                      <Link href="/categories/burger" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Burgers</Link>
                      <Link href="/categories/pizza" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Pizza</Link>
                      <Link href="/categories/fastfood" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Fast-Food</Link>
                      <Link href="/categories/setmenu" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Set Menus</Link>
                      <Link href="/categories/appetizers" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Appetizers</Link>
                      <Link href="/categories/chinese" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Chinese</Link>
                      <Link href="/categories/italian" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Italian</Link>
                      <Link href="/categories/traditional" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Traditional</Link>
                      <Link href="/categories/coffee" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Coffee</Link>
                      <Link href="/categories/drinks" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Drinks & Beverages</Link>
                    </div>
                  </div>
                )}
              </div>
              <Link href="/our-menu" className="text-gray-700 hover:text-primary-600 font-medium">
                Menu
              </Link>
            </nav>
            {/* Search Box */}
            <form className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-gray-100 text-black"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search className="w-5 h-5" />
              </span>
            </form>

            {/* Wishlist */}
            <button className="p-2 text-gray-600 hover:text-primary-600">
              <Heart className="w-5 h-5" />
            </button>

            {/* User Account */}
            <button className="p-2 text-gray-600 hover:text-primary-600">
              <User className="w-5 h-5" />
            </button>

            {/* Shopping Cart */}
            <button className="relative p-2 text-gray-600 hover:text-primary-600">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-primary-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <Link
                href="/"
                className="block px-3 py-2 text-gray-700 hover:text-primary-600 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                All Items
              </Link>
              <Link
                href="/categories"
                className="block px-3 py-2 text-gray-700 hover:text-primary-600 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Categories
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header