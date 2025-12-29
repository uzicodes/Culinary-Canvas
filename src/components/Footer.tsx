'use client'

import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Clock, ChevronRight } from 'lucide-react'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* 1. Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-white p-1">
                <img src="/without_BG_logo.png" alt="Culinary Canvas Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-2xl font-bold tracking-tight">Culinary <span className="text-yellow-400">Canvas</span></span>
            </div>
            <p className="text-gray-400 leading-relaxed text-sm">
              Art your healthy way to life. We are dedicated to providing the freshest, organic ingredients and delicious meals delivered with speed and care.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, index) => (
                <button key={index} className="w-9 h-9 bg-gray-800 hover:text-yellow-400 hover:scale-110 rounded-full flex items-center justify-center transition-all shadow-lg">
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* 2. Popular Categories */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold border-b border-gray-800 pb-2">Popular Categories</h3>
            <ul className="grid grid-cols-1 gap-3">
              {['Burgers', 'Pizza', 'Fast Foods', 'Traditional', 'Desserts'].map((item) => (
                <li key={item}>
                  <Link 
                    href={`/all-items?category=${item.toLowerCase().replace(' ', '')}`} 
                    className="text-gray-400 hover:text-yellow-400 transition-colors text-sm flex items-center group"
                  >
                    <ChevronRight className="w-3 h-3 mr-2 text-yellow-500 opacity-0 group-hover:opacity-100 transition-all" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Customer Support */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold border-b border-gray-800 pb-2">Our Services</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/track-order" className="text-gray-400 hover:text-yellow-400 transition-colors">Track Your Order</Link></li>
              <li><Link href="/delivery-info" className="text-gray-400 hover:text-yellow-400 transition-colors">Delivery Information</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-yellow-400 transition-colors">Help & FAQs</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-yellow-400 transition-colors">Contact Support</Link></li>
              <li><Link href="/careers" className="text-gray-400 hover:text-yellow-400 transition-colors">Join Our Team</Link></li>
            </ul>
          </div>

          {/* 4. Contact & Hours */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold border-b border-gray-800 pb-2">Get In Touch</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-yellow-500 shrink-0" />
                <span className="text-gray-400">123 Foodie Street, Gulshan 2, Dhaka 1212</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-yellow-500 shrink-0" />
                <span className="text-gray-400">+880 1700 000 000</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-yellow-500 shrink-0" />
                <div className="text-gray-400">
                  <p>Mon - Fri: 09:00 - 23:00</p>
                  <p>Sat - Sun: 10:00 - 00:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-16 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 font-medium">
            <p>© {new Date().getFullYear()} <span className="text-yellow-400">Culinary Canvas</span>. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="hover:text-yellow-400">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-yellow-400">Terms of Service</Link>
              <Link href="/cookies" className="hover:text-yellow-400">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer