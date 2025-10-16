"use client";
import Image from 'next/image';

import { Search } from 'lucide-react';
import Header from '@/components/Header';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}
export default function AllProductsPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const router = useRouter();
  const activeCategory = typeof searchParams?.category === 'string' ? searchParams.category : 'all';
  const searchTerm = typeof searchParams?.search === 'string' ? searchParams.search : '';
  // Cart state and addToCart logic removed for SSR/static compatibility

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'burger', label: 'Burgers' },
    { id: 'pizza', label: 'Pizza' },
    { id: 'fastfood', label: 'Fast-Food' },
    { id: 'setmenu', label: 'Set Menus' },
    { id: 'appetizers', label: 'Appetizers' },
  { id: 'desserts', label: 'Desserts' },
    { id: 'chinese', label: 'Chinese' },
    { id: 'italian', label: 'Italian' },
    { id: 'traditional', label: 'Traditional' },
    { id: 'coffee', label: 'Coffee' },
    { id: 'drinks', label: 'Drinks & Beverages' },
  ];

  const menuItems: MenuItem[] = [
  { id: 1, name: 'Classic Cheeseburger', description: 'Juicy beef patty with melted cheese ', price: 350, category: 'burger', image: '/items/burger/classic.png' },
  { id: 2, name: 'Bacon Burger', description: 'Crispy bacon with beef patty and cheddar', price: 400, category: 'burger', image: '/items/burger/bacon.png' },
  { id: 3, name: 'Double Cheese Burger', description: 'Double patty with double cheese', price: 450, category: 'burger', image: '/items/burger/double.png' },
  { id: 4, name: 'Margherita Pizza', description: 'Fresh mozzarella, tomato, and basil', price: 700, category: 'pizza', image: '/items/pizza/margherita.png' },
  { id: 5, name: 'Pepperoni Pizza', description: 'Classic pepperoni with mozzarella cheese', price: 750, category: 'pizza', image: '/items/pizza/pepperoni.png' },
  { id: 6, name: 'Deluxe Pizza', description: 'Loaded with vegetables and meat', price: 800, category: 'pizza', image: '/items/pizza/deluxe.png' },
  { id: 7, name: 'Fried Wings', description: 'Crispy wings with special sauce', price: 320, category: 'fastfood', image: '/items/fastfood/fried_chicken.png' },
  { id: 8, name: 'French Fries', description: 'Crispy golden fries with ketchup & Mustard Sauce', price: 120, category: 'fastfood', image: '/items/fastfood/fries.png' },
  { id: 9, name: 'Chicken Tenders', description: 'Breaded chicken strips', price: 350, category: 'fastfood', image: '/items/fastfood/tenders.png' },
  { id: 10, name: 'Jamaican Chicken', description: 'Jamaican styled chicken with sauce', price: 1200, category: 'setmenu', image: '/items/setmenu/1.png' },
  { id: 11, name: 'Beef Blaster', description: 'Striped Beef with fried rice', price: 500, category: 'setmenu', image: '/items/setmenu/2.png' },
  { id: 30, name: 'Steak Salad', description: 'Includes a beef stake with salad with rice', price: 900, category: 'setmenu', image: '/items/setmenu/3.png' },
    { id: 41, name: 'Chicken Carnival', description: 'Festive chicken platter with sides', price: 1100, category: 'setmenu', image: '/items/setmenu/chicken carnival.png' },
  { id: 12, name: 'Spring Rolls', description: 'Crispy spring rolls with dipping sauce', price: 180, category: 'appetizers', image: '/items/appetizers/spring_rolls.png' },
  { id: 13, name: 'Garlic Bread', description: 'Toasted bread with garlic butter', price: 150, category: 'appetizers', image: '/items/appetizers/garlic_bread.png' },
  { id: 14, name: 'Chicken Dumplings', description: 'Steamed dumplings with sauce', price: 220, category: 'appetizers', image: '/items/appetizers/dumplings.png' },
  { id: 36, name: 'Croissant', description: 'Buttery, flaky French pastry', price: 160, category: 'desserts', image: '/items/desserts/croissant.png' },
  { id: 38, name: 'Strawberry Donut', description: 'Sweet donut with strawberry glaze', price: 140, category: 'desserts', image: '/items/desserts/strawberry_donut.png' },
  { id: 39, name: 'Chocolate Donut', description: 'Rich chocolate glazed donut', price: 140, category: 'desserts', image: '/items/desserts/chocolate_donut.png' },
  { id: 40, name: 'Tiramisu', description: 'Classic Italian coffee-flavored dessert', price: 220, category: 'desserts', image: '/items/desserts/tiramisu.png' },
  { id: 36, name: 'Brownie', description: 'Chocolate brownie with nuts', price: 120, category: 'desserts', image: '/items/desserts/brownie.png' }
  ];


  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      {/* Search Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-slate-400" size={20} />
            <form method="get" action="/all-items">
              <input
                type="text"
                name="search"
                placeholder="Search for food items..."
                defaultValue={searchTerm}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {/* Hidden input for category to preserve filter on search */}
              {activeCategory !== 'all' && (
                <input type="hidden" name="category" value={activeCategory} />
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex gap-3 flex-wrap pb-2">
            {categories.map(cat => {
              // Build URL with category and current search term
              const params = new URLSearchParams();
              if (cat.id !== 'all') params.set('category', cat.id);
              if (searchTerm) params.set('search', searchTerm);
              const href = params.toString() ? `/all-items?${params}` : '/all-items';
              return (
                <a
                  key={cat.id}
                  href={href}
                  className={`px-3 py-1.5 text-sm rounded-full whitespace-nowrap transition-all ${
                    activeCategory === cat.id
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {cat.label}
                </a>
              );
            })}
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
                {item.image.startsWith('/') ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={192}
                    height={192}
                    className="object-cover w-full h-full"
                    priority={false}
                  />
                ) : (
                  <Image
                    src={'/items/fallback.png'}
                    alt="No image"
                    width={192}
                    height={192}
                    className="object-cover w-full h-full"
                    priority={false}
                  />
                )}
              </div>
              <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 text-center">{item.name}</h3>
                  <p className="text-slate-600 text-sm mt-1 mb-3 text-center">{item.description}</p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t">
                  <span className="text-base font-bold text-[#F1F604]">৳{item.price}</span>
                  <button
                    className="bg-[#F1F604] hover:bg-yellow-300 text-[#029FBE] px-2 py-1 rounded text-xs font-bold transition-colors"
                    type="button"
                    onClick={() => {
                      const cartItem = { ...item, _id: String(item.id), quantity: 1 };
                      let cart = [];
                      if (typeof window !== 'undefined') {
                        const saved = localStorage.getItem('cart');
                        cart = saved ? JSON.parse(saved) : [];
                        const existing = cart.find((i: any) => i._id === cartItem._id);
                        if (existing) {
                          existing.quantity += 1;
                        } else {
                          cart.push(cartItem);
                        }
                        localStorage.setItem('cart', JSON.stringify(cart));
                        window.dispatchEvent(new Event('storage'));
                        router.push('/cart');
                      }
                    }}
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

      <Footer />
    </div>
  );
}
