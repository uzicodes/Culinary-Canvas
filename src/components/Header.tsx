'use client'

import { useState } from 'react'
import { ShoppingCart, Search, Menu, X, User, Heart } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
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

          {/* Navigation Menu - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary-600 font-medium">
              All Product
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-primary-600 font-medium">
              Categories
            </Link>
            <Link href="/useful-links" className="text-gray-700 hover:text-primary-600 font-medium">
              Useful Links
            </Link>
            <Link href="/accessories" className="text-gray-700 hover:text-primary-600 font-medium">
              Accessories
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button className="p-2 text-gray-600 hover:text-primary-600">
              <Search className="w-5 h-5" />
            </button>

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
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <Link
                href="/"
                className="block px-3 py-2 text-gray-700 hover:text-primary-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                All Product
              </Link>
              <Link
                href="/categories"
                className="block px-3 py-2 text-gray-700 hover:text-primary-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                href="/useful-links"
                className="block px-3 py-2 text-gray-700 hover:text-primary-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Useful Links
              </Link>
              <Link
                href="/accessories"
                className="block px-3 py-2 text-gray-700 hover:text-primary-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Accessories
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header