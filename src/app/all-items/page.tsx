'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ShoppingCart, Search } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';


interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

export default function AllProductsPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams?.get('category') || 'all';
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  // Update activeCategory if the URL changes (e.g., user navigates from dropdown)
  useEffect(() => {
    setActiveCategory(searchParams?.get('category') || 'all');
  }, [searchParams]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<MenuItem[]>([]);

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'burger', label: 'Burgers' },
    { id: 'pizza', label: 'Pizza' },
    { id: 'fastfood', label: 'Fast-Food' },
    { id: 'setmenu', label: 'Set Menus' },
    { id: 'appetizers', label: 'Appetizers' },
    { id: 'chinese', label: 'Chinese' },
    { id: 'italian', label: 'Italian' },
    { id: 'traditional', label: 'Traditional' },
    { id: 'coffee', label: 'Coffee' },
    { id: 'drinks', label: 'Drinks & Beverages' },
  ];

  const menuItems: MenuItem[] = [
    { id: 1, name: 'Classic Cheeseburger', description: 'Juicy beef patty with melted cheese ', price: 8.99, category: 'burger', image: '🍔' },
    { id: 2, name: 'Bacon Burger', description: 'Crispy bacon with beef patty and cheddar', price: 9.99, category: 'burger', image: '🍔' },
    { id: 3, name: 'Double Cheese Burger', description: 'Double patty with double cheese', price: 10.99, category: 'burger', image: '🍔' },
    { id: 4, name: 'Margherita Pizza', description: 'Fresh mozzarella, tomato, and basil', price: 12.99, category: 'pizza', image: '🍕' },
    { id: 5, name: 'Pepperoni Pizza', description: 'Classic pepperoni with mozzarella cheese', price: 13.99, category: 'pizza', image: '🍕' },
    { id: 6, name: 'Deluxe Pizza', description: 'Loaded with vegetables and meat', price: 14.99, category: 'pizza', image: '🍕' },
    { id: 7, name: 'Fried Chicken Wings', description: 'Crispy wings with special sauce', price: 7.99, category: 'fastfood', image: '🍗' },
    { id: 8, name: 'French Fries', description: 'Crispy golden fries with salt', price: 3.99, category: 'fastfood', image: '🍟' },
    { id: 9, name: 'Chicken Tenders', description: 'Breaded chicken strips', price: 8.49, category: 'fastfood', image: '🍗' },
    { id: 10, name: 'Family Combo', description: '2 burgers, 2 pizzas, fries and drink', price: 34.99, category: 'setmenu', image: '🍽️' },
    { id: 11, name: 'Lunch Special', description: 'Burger, fries and beverage', price: 11.99, category: 'setmenu', image: '🍽️' },
    { id: 12, name: 'Spring Rolls', description: 'Crispy spring rolls with dipping sauce', price: 5.99, category: 'appetizers', image: '🥟' },
    { id: 13, name: 'Garlic Bread', description: 'Toasted bread with garlic butter', price: 4.99, category: 'appetizers', image: '🍞' },
    { id: 14, name: 'Chicken Dumplings', description: 'Steamed dumplings with sauce', price: 6.99, category: 'appetizers', image: '🥟' },
    { id: 15, name: 'Kung Pao Chicken', description: 'Spicy chicken with peanuts and vegetables', price: 11.99, category: 'chinese', image: '🍜' },
    { id: 16, name: 'Fried Rice', description: 'Egg fried rice with vegetables', price: 9.99, category: 'chinese', image: '🍚' },
    { id: 17, name: 'Sweet and Sour Pork', description: 'Tender pork in sweet and sour sauce', price: 10.99, category: 'chinese', image: '🍜' },
    { id: 18, name: 'Fettuccine Alfredo', description: 'Pasta with creamy alfredo sauce', price: 12.99, category: 'italian', image: '🍝' },
    { id: 19, name: 'Spaghetti Carbonara', description: 'Classic Italian pasta with eggs and bacon', price: 11.99, category: 'italian', image: '🍝' },
    { id: 20, name: 'Lasagna', description: 'Layers of pasta and meat sauce', price: 13.99, category: 'italian', image: '🍝' },
    { id: 21, name: 'Biryani', description: 'Fragrant rice with spiced meat', price: 12.99, category: 'traditional', image: '🍚' },
    { id: 22, name: 'Tandoori Chicken', description: 'Grilled chicken with traditional spices', price: 13.99, category: 'traditional', image: '🍗' },
    { id: 23, name: 'Dal Curry', description: 'Lentil curry with traditional spices', price: 8.99, category: 'traditional', image: '🍲' },
    { id: 24, name: 'Espresso', description: 'Strong concentrated coffee', price: 3.99, category: 'coffee', image: '☕' },
    { id: 25, name: 'Cappuccino', description: 'Coffee with steamed milk and foam', price: 4.99, category: 'coffee', image: '☕' },
    { id: 26, name: 'Iced Coffee', description: 'Chilled coffee with ice', price: 4.49, category: 'coffee', image: '☕' },
    { id: 27, name: 'Fresh Orange Juice', description: 'Freshly squeezed orange juice', price: 4.99, category: 'drinks', image: '🧃' },
    { id: 28, name: 'Coca Cola', description: 'Classic soft drink', price: 2.99, category: 'drinks', image: '🥤' },
    { id: 29, name: 'Iced Tea', description: 'Refreshing iced tea', price: 3.49, category: 'drinks', image: '🧋' },
  ];

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (item: MenuItem) => {
    setCart([...cart, item]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      {/* Search Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search for food items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items Grid */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-6 gap-4">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="bg-[#029FBE] rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden flex flex-col h-96"
            >
              <div className="bg-[#19b368] h-48 flex items-center justify-center text-6xl">
                {item.image}
              </div>
              <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 text-center">{item.name}</h3>
                  <p className="text-slate-600 text-sm mt-1 mb-3 text-center">{item.description}</p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t">
                  <span className="text-base font-bold text-[#F1F604]">${item.price.toFixed(2)}</span>
                  <button
                    onClick={() => addToCart(item)}
                    className="bg-[#F1F604] hover:bg-yellow-300 text-[#029FBE] px-2 py-1 rounded text-xs font-bold transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-slate-500">No items found matching your search.</p>
          </div>
        )}
      </main>

      {/* Cart Summary */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-orange-500 text-white p-4 rounded-lg shadow-lg">
          <p className="text-sm">Items in cart: {cart.length}</p>
          <p className="text-lg font-bold">Total: ${cartTotal.toFixed(2)}</p>
          <button className="w-full mt-2 bg-white text-orange-600 font-bold py-2 rounded hover:bg-slate-100 transition-colors">
            Checkout
          </button>
        </div>
      )}
      <Footer />
    </div>
  );
}
