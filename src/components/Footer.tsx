'use client'

import {
  Facebook, Twitter, Instagram, Youtube, Mail, Phone,
  MapPin, Clock, ChevronRight, Github, Globe
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Company Info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden bg-white p-1">
                <Image src="/without_BG_logo.png" alt="Logo" width={32} height={32} className="object-contain" />
              </div>
              <span className="text-xl tracking-tight" style={{ fontFamily: 'Nalinak, Inter, sans-serif' }}><span className="text-yellow-400">Culinary Canvas</span></span>
            </div>
            <p className="text-gray-400 leading-relaxed text-xs">
              Art your healthy way to life. Fresh, Healthy dishes delivered with speed & care.
            </p>
            <div className="flex space-x-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, index) => (
                <button key={index} className="w-8 h-8 bg-gray-800 hover:text-yellow-400 hover:scale-110 rounded-full flex items-center justify-center transition-all shadow-md">
                  <Icon className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
          </div>

          {/* Popular Categories */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold border-b border-gray-800 pb-1 uppercase tracking-wider text-green-400">Categories</h3>
            <ul className="grid grid-cols-1 gap-1.5">
              {['Burgers', 'Pizza', 'Fast Foods', 'Traditional', 'Desserts'].map((item) => (
                <li key={item}>
                  <Link
                    href={`/all-items?category=${item.toLowerCase().replace(' ', '')}`}
                    className="text-gray-400 hover:text-yellow-400 transition-colors text-xs flex items-center group"
                  >
                    <ChevronRight className="w-3 h-3 mr-1.5 text-yellow-500 opacity-0 group-hover:opacity-100 transition-all" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Support */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold border-b border-gray-800 pb-1 uppercase tracking-wider text-green-400">Our Services</h3>
            <ul className="space-y-1.5 text-[11px]">
              <li><Link href="/track-order" className="text-gray-400 hover:text-yellow-400 transition-colors">Track Order</Link></li>
              <li><Link href="/delivery-info" className="text-gray-400 hover:text-yellow-400 transition-colors">Delivery Info</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-yellow-400 transition-colors">Help & FAQs</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-yellow-400 transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold border-b border-gray-800 pb-1 uppercase tracking-wider text-green-400">Get In Touch</h3>
            <div className="space-y-2 text-[11px]">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-yellow-500 shrink-0" />
                <span className="text-gray-400">Gulshan 2, Dhaka 1212</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-yellow-500 shrink-0" />
                <span className="text-gray-400">+880 1700 000 000</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-yellow-500 shrink-0" />
                <span className="text-gray-400">Daily: 09:00 - 23:00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar*/}
        <div className="border-t border-gray-800 mt-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 items-center text-[10px] text-gray-500 font-medium gap-4">

            {/* Copyright */}
            <div className="text-center md:text-left">
              <p>© {new Date().getFullYear()} <span className="text-yellow-400 font-bold">  Culinary Canvas</span></p> <span className="hidden md:inline"> All rights reserved.</span>
            </div>

            {/* Developer Info */}
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="flex items-center space-x-3 text-gray-500">
                <span className="whitespace-nowrap">DEVELOPER</span>
                <span className="text-gray-700">|</span>
                <div className="flex space-x-3">
                  <Link href="https://github.com/uzicodes" target="_blank" className="hover:text-yellow-400 transition-colors">
                    <Github className="w-3.5 h-3.5" />
                  </Link>
                  <Link href="https://utshochowdhury.me" target="_blank" className="hover:text-yellow-400 transition-colors">
                    <Globe className="w-3.5 h-3.5" />
                  </Link>
                  <Link href="mailto:utshozi11@gmail.com" className="hover:text-yellow-400 transition-colors">
                    <Mail className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
              <Link href="/admin/login" className="text-[9px] font-bold text-gray-400 hover:text-yellow-400 uppercase tracking-widest border border-gray-800 hover:border-yellow-400 px-3 py-1 rounded-full transition-all">
                Admin Login
              </Link>
            </div>

            {/* Policy Links */}
            <div className="flex justify-center md:justify-end space-x-4">
              <Link href="/privacy" className="hover:text-yellow-400 transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-yellow-400 transition-colors">Terms</Link>
              <Link href="/cookies" className="hover:text-yellow-400 transition-colors">Cookies</Link>
            </div>

          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer