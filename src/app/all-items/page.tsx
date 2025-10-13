"use client";

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
    { id: 'chinese', label: 'Chinese' },
    { id: 'italian', label: 'Italian' },
    { id: 'traditional', label: 'Traditional' },
    { id: 'coffee', label: 'Coffee' },
    { id: 'drinks', label: 'Drinks & Beverages' },
  ];

  const menuItems: MenuItem[] = [
    { id: 1, name: 'Classic Cheeseburger', description: 'Juicy beef patty with melted cheese ', price: 8.99, category: 'burger', image: '/items/burger/classic.png' },
    { id: 2, name: 'Bacon Burger', description: 'Crispy bacon with beef patty and cheddar', price: 9.99, category: 'burger', image: '/items/burger/bacon.png' },
    { id: 3, name: 'Double Cheese Burger', description: 'Double patty with double cheese', price: 10.99, category: 'burger', image: '/items/burger/double.png' },
    { id: 4, name: 'Margherita Pizza', description: 'Fresh mozzarella, tomato, and basil', price: 12.99, category: 'pizza', image: '/items/pizza/margherita.png' },
    { id: 5, name: 'Pepperoni Pizza', description: 'Classic pepperoni with mozzarella cheese', price: 13.99, category: 'pizza', image: '/items/pizza/pepperoni.png' },
    { id: 6, name: 'Deluxe Pizza', description: 'Loaded with vegetables and meat', price: 14.99, category: 'pizza', image: '/items/pizza/deluxe.png' },
    { id: 7, name: 'Fried Chicken Wings', description: 'Crispy wings with special sauce', price: 7.99, category: 'fastfood', image: '/items/fastfood/fried_chicken.png' },
    { id: 8, name: 'French Fries', description: 'Crispy golden fries with salt', price: 3.99, category: 'fastfood', image: '/items/fastfood/fries.png' },
    { id: 9, name: 'Chicken Tenders', description: 'Breaded chicken strips', price: 8.49, category: 'fastfood', image: '/items/fastfood/tenders.png' },
    { id: 10, name: 'Jamaican Chicken', description: '2 burgers, 2 pizzas, fries and drink', price: 34.99, category: 'setmenu', image: '/items/setmenu/1.png' },
    { id: 11, name: 'Beef Blaster', description: 'Burger, fries and beverage', price: 11.99, category: 'setmenu', image: '/items/setmenu/2.png' },
    { id: 30, name: 'Beef Steak Platter', description: 'Includes burger, pizza, fries, drink, and dessert', price: 24.99, category: 'setmenu', image: '/items/setmenu/3.png' },
    { id: 12, name: 'Spring Rolls', description: 'Crispy spring rolls with dipping sauce', price: 5.99, category: 'appetizers', image: '/items/appetizers/spring_rolls.png' },
    { id: 13, name: 'Garlic Bread', description: 'Toasted bread with garlic butter', price: 4.99, category: 'appetizers', image: '/items/appetizers/garlic_bread.png' },
    { id: 14, name: 'Chicken Dumplings', description: 'Steamed dumplings with sauce', price: 6.99, category: 'appetizers', image: '/items/appetizers/dumplings.png' },
    { id: 15, name: 'Kung Pao Chicken', description: 'Spicy chicken with peanuts and vegetables', price: 11.99, category: 'chinese', image: '/items/chinese/kung_pao.png' },
    { id: 16, name: 'Basil Fried Rice', description: 'Egg fried rice with vegetables', price: 9.99, category: 'chinese', image: '/items/chinese/basil_fried_rice.png' },
    { id: 17, name: 'Sweet and Sour Pork', description: 'Tender pork in sweet and sour sauce', price: 10.99, category: 'chinese', image: '/items/chinese/pork.png' },
    { id: 18, name: 'Fettuccine Alfredo', description: 'Pasta with creamy alfredo sauce', price: 12.99, category: 'italian', image: '/items/italian/alfredo.png' },
    { id: 19, name: 'Spaghetti Carbonara', description: 'Classic Italian pasta with eggs and bacon', price: 11.99, category: 'italian', image: '/items/italian/spaghetti.png' },
    { id: 20, name: 'Lasagna', description: 'Layers of pasta and meat sauce', price: 13.99, category: 'italian', image: '/items/italian/lasagna.png' },
    { id: 32, name: 'Risotto', description: 'Creamy Italian rice dish with parmesan and mushrooms', price: 12.49, category: 'italian', image: '/items/italian/risotto.png' },
    { id: 21, name: 'Biryani', description: 'Fragrant rice with spiced meat', price: 12.99, category: 'traditional', image: '/items/traditional/biriyani.png' },
    { id: 22, name: 'Tandoori Chicken', description: 'Grilled chicken with traditional spices', price: 13.99, category: 'traditional', image: '/items/traditional/tandoori.png' },
    { id: 23, name: 'Dal Curry', description: 'Lentil curry with traditional spices', price: 8.99, category: 'traditional', image: '/items/traditional/dal.png' },
    { id: 34, name: 'Butter Chicken', description: 'Rich and creamy tomato-based curry with tender chicken', price: 14.49, category: 'traditional', image: '/items/traditional/butter.png' },
    { id: 24, name: 'Espresso', description: 'Strong concentrated coffee', price: 3.99, category: 'coffee', image: '/items/coffee/espresso.png' },
    { id: 25, name: 'Cappuccino', description: 'Coffee with steamed milk and foam', price: 4.99, category: 'coffee', image: '/items/coffee/cappuccino.png' },
    { id: 26, name: 'Iced Coffee', description: 'Chilled coffee with ice', price: 4.49, category: 'coffee', image: '/items/coffee/iced_coffee.png' },
    { id: 27, name: 'Fresh Orange Juice', description: 'Freshly squeezed orange juice', price: 4.99, category: 'drinks', image: '/items/drinks/orange.png' },
    { id: 28, name: 'Coca Cola', description: 'Classic soft drink', price: 2.99, category: 'drinks', image: '/items/drinks/coke.png' },
    { id: 29, name: 'Iced Tea', description: 'Refreshing iced tea', price: 3.49, category: 'drinks', image: '/items/drinks/iced_tea.png' },
    { id: 35, name: 'Sprite', description: 'Lemon-lime flavored soft drink', price: 2.99, category: 'drinks', image: '/items/drinks/sprite.png' },
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
          <div className="flex gap-2 overflow-x-auto pb-2">
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
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
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
                {item.image.endsWith('.png') || item.image.endsWith('.jpg') || item.image.endsWith('.jpeg') || item.image.endsWith('.webp') ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <span>{item.image}</span>
                )}
              </div>
              <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 text-center">{item.name}</h3>
                  <p className="text-slate-600 text-sm mt-1 mb-3 text-center">{item.description}</p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t">
                  <span className="text-base font-bold text-[#F1F604]">${item.price.toFixed(2)}</span>
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
