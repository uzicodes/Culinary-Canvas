"use client";

import Image from 'next/image';
import { Search, Pencil, Check, X } from 'lucide-react';
import Header from '@/components/Header';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import { motion, Variants } from 'framer-motion';
import { useSession } from 'next-auth/react';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

// Animation Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function AllProductsPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.role === 'admin';

  const activeCategory = typeof searchParams?.category === 'string' ? searchParams.category : 'all';
  const searchTerm = typeof searchParams?.search === 'string' ? searchParams.search : '';
  const selectedId = typeof searchParams?.id === 'string' ? searchParams.id : undefined;
  const [showToast, setShowToast] = useState(false);
  const initialMenuItems: MenuItem[] = [
    { id: 1, name: 'Classic Cheeseburger', description: 'Juicy beef patty with melted cheese ', price: 350, category: 'burger', image: '/items/burger/classic.png' },
    { id: 2, name: 'Bacon Burger', description: 'Crispy bacon with beef patty and cheddar', price: 400, category: 'burger', image: '/items/burger/bacon.png' },
    { id: 3, name: 'Double Cheese Burger', description: 'Double patty with double cheese', price: 450, category: 'burger', image: '/items/burger/double.png' },
    { id: 31, name: 'Smashed Burger', description: 'Crispy smashed beef patty with cheese and special sauce', price: 420, category: 'burger', image: '/items/burger/smashed_burger.png' },
    { id: 4, name: 'Margherita Pizza', description: 'Fresh mozzarella, tomato, and basil', price: 700, category: 'pizza', image: '/items/pizza/margherita.png' },
    { id: 5, name: 'Pepperoni Pizza', description: 'Classic pepperoni with mozzarella cheese', price: 750, category: 'pizza', image: '/items/pizza/pepperoni.png' },
    { id: 6, name: 'Deluxe Pizza', description: 'Loaded with vegetables and meat', price: 800, category: 'pizza', image: '/items/pizza/deluxe.png' },
    { id: 32, name: 'Detroit Pizza', description: 'Thick, crispy-edged Detroit-style pizza with cheese and tomato sauce', price: 850, category: 'pizza', image: '/items/pizza/detroit.png' },
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
    { id: 37, name: 'Brownie', description: 'Chocolate brownie with nuts', price: 120, category: 'desserts', image: '/items/desserts/brownie.png' },
    { id: 50, name: 'Kung Pao Chicken', description: 'Spicy stir-fried chicken with peanuts and vegetables', price: 450, category: 'chinese', image: '/items/chinese/kung_pao.png' },
    { id: 51, name: 'Shrimp Spaghetti', description: 'Spaghetti with shrimp in a savory sauce', price: 480, category: 'chinese', image: '/items/chinese/shrimp_spaghetti.png' },
    { id: 52, name: 'Basil Fried Rice', description: 'Egg fried rice with fresh basil and vegetables', price: 350, category: 'chinese', image: '/items/chinese/basil_fried_rice.png' },
    { id: 60, name: 'Fettuccine Alfredo', description: 'Pasta with creamy Alfredo sauce', price: 600, category: 'italian', image: '/items/italian/alfredo.png' },
    { id: 62, name: 'Lasagna', description: 'Classic Italian layered pasta with meat and cheese', price: 650, category: 'italian', image: '/items/italian/lasagna.png' },
    { id: 63, name: 'Risotto', description: 'Creamy Italian rice dish with parmesan and mushrooms', price: 600, category: 'italian', image: '/items/italian/risotto.png' },
    { id: 64, name: 'Spaghetti', description: 'Traditional Italian spaghetti with herbs', price: 550, category: 'italian', image: '/items/italian/spaghetti.png' },
    { id: 70, name: 'Chicken Biryani', description: 'Spiced rice with chicken and herbs', price: 500, category: 'traditional', image: '/items/traditional/biryani.png' },
    { id: 75, name: 'Butter Naan', description: 'Soft naan brushed with butter', price: 60, category: 'traditional', image: '/items/traditional/butter.png' },
    { id: 76, name: 'Tandoori Chicken', description: 'Smoky tandoor-roasted marinated chicken', price: 550, category: 'traditional', image: '/items/traditional/tandoori.png' },
    { id: 71, name: 'Dal Tadka', description: 'Yellow lentils cooked with spices', price: 120, category: 'traditional', image: '/items/traditional/dal.png' },
    { id: 77, name: 'Chicken Karahi', description: 'Spicy Pakistani chicken karahi with tomatoes', price: 650, category: 'pakistani', image: '/items/pakistani/karahi.png' },
    { id: 78, name: 'Haleem', description: 'Traditional Pakistani meat & lentil stew', price: 450, category: 'pakistani', image: '/items/pakistani/haleem.png' },
    { id: 79, name: 'Seekh Kebab', description: '4pcs Grilled spiced minced meat skewers', price: 400, category: 'pakistani', image: '/items/pakistani/kebab.png' },
    { id: 80, name: 'Chapli Kebab', description: 'Flat spiced meat patties from Peshawar', price: 420, category: 'pakistani', image: '/items/pakistani/chapli.png' },
    { id: 81, name: 'Nalli Nihari', description: 'Premium slow-cooked beef shank with bone marrow & spices', price: 650, category: 'pakistani', image: '/items/pakistani/nihari.png' },
    { id: 82, name: 'Mutton Paya', description: 'Rich mutton trotters curry cooked overnight', price: 600, category: 'pakistani', image: '/items/pakistani/paya.png' },
    { id: 72, name: 'BIG Wrap', description: 'Large wrap filled with fresh veggies and meat', price: 220, category: 'appetizers', image: '/items/appetizers/BIG Wrap.png' },
    { id: 73, name: 'Cheezy Nachos', description: 'Nachos topped with melted cheese and dips', price: 200, category: 'appetizers', image: '/items/appetizers/Cheezy Nachos.png' },
    { id: 74, name: 'Dual Tacos', description: 'Two tacos with assorted fillings', price: 240, category: 'appetizers', image: '/items/appetizers/Dual Tacos.png' },
    { id: 85, name: 'Espresso', description: 'Strong and rich coffee shot', price: 120, category: 'coffee', image: '/items/coffee/espresso.png' },
    { id: 86, name: 'Cappuccino', description: 'Espresso with steamed milk and foam', price: 180, category: 'coffee', image: '/items/coffee/cappuccino.png' },
    { id: 87, name: 'Iced Coffee', description: 'Chilled coffee with ice', price: 160, category: 'coffee', image: '/items/coffee/iced_coffee.png' },
    { id: 90, name: 'Coca Cola', description: 'Classic soft drink', price: 60, category: 'drinks', image: '/items/drinks/coke.png' },
    { id: 91, name: 'Sprite', description: 'Lemon-lime flavored soda', price: 60, category: 'drinks', image: '/items/drinks/sprite.png' },
    { id: 92, name: 'Orange Juice', description: 'Freshly squeezed orange juice', price: 100, category: 'drinks', image: '/items/drinks/orange.png' },
    { id: 93, name: 'Lemonade', description: 'Freshly squeezed lemonade', price: 80, category: 'drinks', image: '/items/drinks/lemonade.png' },
    { id: 94, name: 'Iced Tea', description: 'Chilled tea with lemon', price: 90, category: 'drinks', image: '/items/drinks/iced_tea.png' },
    { id: 95, name: 'Matcha', description: 'Refreshing Japanese green tea', price: 200, category: 'drinks', image: '/items/drinks/matcha.png' }
  ];

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
    { id: 'pakistani', label: 'Pakistani' },
    { id: 'coffee', label: 'Coffee' },
    { id: 'drinks', label: 'Drinks & Beverages' },
  ];

  let filteredItems = initialMenuItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // If id param is present, show only that item (if found)
  if (selectedId) {
    const found = initialMenuItems.find(item => String(item.id) === selectedId);
    filteredItems = found ? [found] : [];
  }

  return (
    <div className="min-h-screen bg-[#F7FBE7] pt-28">
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
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-black placeholder:text-gray-400"
              />
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

      <main className="max-w-7xl mx-auto px-4 py-8">
        <motion.div 
          key={activeCategory + searchTerm}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-6 gap-4"
        >
          {filteredItems.map(item => (
            <ItemCard key={item.id} item={item} isAdmin={isAdmin} setShowToast={setShowToast} />
          ))}
        </motion.div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-slate-500">No items found matching your search.</p>
          </div>
        )}
      </main>

      <Footer />
      {showToast && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded shadow-lg z-50 transition-all">
          Item updated/added successfully!
        </div>
      )}
    </div>
  );
}


function ItemCard({ item, isAdmin, setShowToast }: { item: MenuItem, isAdmin: boolean, setShowToast: (v: boolean) => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState(item);

  const handleSave = () => {
    console.log("Saving changes to DB:", editedItem);
    setIsEditing(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1500);
  };

  return (
    <motion.div
      variants={itemVariants}
      className="bg-[#029FBE] rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden flex flex-col h-90 relative"
    >
      {/* Admin Edit Trigger */}
      {isAdmin && !isEditing && (
        <button 
          onClick={() => setIsEditing(true)}
          className="absolute top-2 right-2 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow-md text-gray-700 transition-all"
        >
          <Pencil size={16} />
        </button>
      )}

      <div className="bg-[#19b368] h-48 flex items-center justify-center relative">
        <Image
          src={editedItem.image}
          alt={editedItem.name}
          width={192}
          height={192}
          className="object-cover w-full h-full"
        />
      </div>

      <div className="p-4 flex flex-col flex-1 justify-between">
        {isEditing ? (
          <div className="space-y-2">
            <input 
              className="w-full text-sm font-bold p-1 rounded border border-gray-300 text-black"
              value={editedItem.name}
              onChange={(e) => setEditedItem({...editedItem, name: e.target.value})}
              placeholder="Name"
            />
            <textarea 
              className="w-full text-xs p-1 rounded border border-gray-300 text-black h-16"
              value={editedItem.description}
              onChange={(e) => setEditedItem({...editedItem, description: e.target.value})}
              placeholder="Description"
            />
            <input 
              type="number"
              className="w-full text-sm font-bold p-1 rounded border border-gray-300 text-black"
              value={editedItem.price}
              onChange={(e) => setEditedItem({...editedItem, price: Number(e.target.value)})}
              placeholder="Price"
            />
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-bold text-black text-center leading-tight">{editedItem.name}</h3>
            <p className="text-slate-100 text-xs mt-2 mb-3 text-center opacity-90 line-clamp-2">{editedItem.description}</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-white/20">
          <span className="text-base font-bold text-[#050BB3]">৳{editedItem.price}</span>
          
          {isEditing ? (
            <div className="flex gap-2">
              <button onClick={handleSave} className="bg-green-500 p-1.5 rounded-full text-white shadow hover:bg-green-600">
                <Check size={16} />
              </button>
              <button onClick={() => { setIsEditing(false); setEditedItem(item); }} className="bg-red-500 p-1.5 rounded-full text-white shadow hover:bg-red-600">
                <X size={16} />
              </button>
            </div>
          ) : (
            <button
              className="bg-[#F1F604] hover:bg-yellow-300 text-[#029FBE] px-3 py-1.5 rounded text-xs font-bold transition-colors"
              onClick={() => {
                const cartItem = { ...editedItem, _id: String(editedItem.id), quantity: 1 };
                if (typeof window !== 'undefined') {
                  const saved = localStorage.getItem('cart');
                  const cart = saved ? JSON.parse(saved) : [];
                  const existing = cart.find((i: any) => i._id === cartItem._id);
                  if (existing) existing.quantity += 1;
                  else cart.push(cartItem);
                  localStorage.setItem('cart', JSON.stringify(cart));
                  window.dispatchEvent(new Event('storage'));
                  setShowToast(true);
                  setTimeout(() => setShowToast(false), 1500);
                }
              }}
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}