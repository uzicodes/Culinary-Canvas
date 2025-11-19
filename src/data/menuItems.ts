export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

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
  { id: 37, name: 'Brownie', description: 'Chocolate brownie with nuts', price: 120, category: 'desserts', image: '/items/desserts/brownie.png' },
  { id: 50, name: 'Kung Pao Chicken', description: 'Spicy stir-fried chicken with peanuts and vegetables', price: 450, category: 'chinese', image: '/items/chinese/kung_pao.png' },
  { id: 51, name: 'Sweet and Sour Pork', description: 'Pork in a tangy sweet and sour sauce', price: 400, category: 'chinese', image: '/items/chinese/pork.png' },
  { id: 52, name: 'Basil Fried Rice', description: 'Egg fried rice with fresh basil and vegetables', price: 350, category: 'chinese', image: '/items/chinese/basil_fried_rice.png' },
  { id: 60, name: 'Fettuccine Alfredo', description: 'Pasta with creamy Alfredo sauce', price: 600, category: 'italian', image: '/items/italian/alfredo.png' },
  
  { id: 62, name: 'Lasagna', description: 'Classic Italian layered pasta with meat and cheese', price: 650, category: 'italian', image: '/items/italian/lasagna.png' },
  { id: 63, name: 'Risotto', description: 'Creamy Italian rice dish with parmesan and mushrooms', price: 600, category: 'italian', image: '/items/italian/risotto.png' },
  { id: 64, name: 'Spaghetti', description: 'Traditional Italian spaghetti with herbs', price: 550, category: 'italian', image: '/items/italian/spaghetti.png' },
  { id: 70, name: 'Chicken Biryani', description: 'Spiced rice with chicken and herbs', price: 500, category: 'traditional', image: '/items/traditional/biryani.png' },
  { id: 75, name: 'Butter Naan', description: 'Soft naan brushed with butter', price: 60, category: 'traditional', image: '/items/traditional/butter.png' },
  { id: 76, name: 'Tandoori Chicken', description: 'Smoky tandoor-roasted marinated chicken', price: 550, category: 'traditional', image: '/items/traditional/tandoori.png' },
  { id: 71, name: 'Dal Tadka', description: 'Yellow lentils cooked with spices', price: 120, category: 'traditional', image: '/items/traditional/dal.png' },
  { id: 72, name: 'BIG Wrap', description: 'Large wrap filled with fresh veggies and meat', price: 220, category: 'appetizers', image: '/items/appetizers/BIG Wrap.png' },
  { id: 73, name: 'Cheezy Nachos', description: 'Nachos topped with melted cheese and dips', price: 200, category: 'appetizers', image: '/items/appetizers/Cheezy Nachos.png' },
  { id: 74, name: 'Dual Tacos', description: 'Two tacos with assorted fillings', price: 240, category: 'appetizers', image: '/items/appetizers/Dual Tacos.png' },
  { id: 80, name: 'Espresso', description: 'Strong and rich coffee shot', price: 120, category: 'coffee', image: '/items/coffee/espresso.png' },
  { id: 81, name: 'Cappuccino', description: 'Espresso with steamed milk and foam', price: 180, category: 'coffee', image: '/items/coffee/cappuccino.png' },
  { id: 82, name: 'Iced Coffee', description: 'Chilled coffee with ice', price: 160, category: 'coffee', image: '/items/coffee/iced_coffee.png' },
  { id: 90, name: 'Coca Cola', description: 'Classic soft drink', price: 60, category: 'drinks', image: '/items/drinks/coke.png' },
  { id: 91, name: 'Sprite', description: 'Lemon-lime flavored soda', price: 60, category: 'drinks', image: '/items/drinks/sprite.png' },
  { id: 92, name: 'Orange Juice', description: 'Freshly squeezed orange juice', price: 100, category: 'drinks', image: '/items/drinks/orange.png' },
  { id: 93, name: 'Lemonade', description: 'Freshly squeezed lemonade', price: 80, category: 'drinks', image: '/items/drinks/lemonade.png' },
  { id: 94, name: 'Iced Tea', description: 'Chilled tea with lemon', price: 90, category: 'drinks', image: '/items/drinks/iced_tea.png' },
  { id: 95, name: 'Matcha', description: 'Refreshing Japanese green tea', price: 200, category: 'drinks', image: '/items/drinks/matcha.png' },
  { id: 100, name: 'Chicken Karahi', description: 'Spicy Pakistani chicken karahi with tomatoes', price: 650, category: 'pakistani', image: '/items/pakistani/karahi.png' },
  { id: 102, name: 'Haleem', description: 'Traditional meat and lentil stew', price: 450, category: 'pakistani', image: '/items/pakistani/haleem.png' },
  { id: 103, name: 'Seekh Kebab', description: 'Grilled spiced minced meat skewers', price: 400, category: 'pakistani', image: '/items/pakistani/seekh_kebab.png' },
  { id: 104, name: 'Chapli Kebab', description: 'Flat spiced meat patties from Peshawar', price: 420, category: 'pakistani', image: '/items/pakistani/chapli_kebab.png' },
  { id: 106, name: 'Nalli Nihari', description: 'Premium slow-cooked beef shank with bone marrow and spices', price: 650, category: 'pakistani', image: '/items/pakistani/nihari.png' },
  { id: 107, name: 'Mutton Paya', description: 'Rich mutton trotters curry cooked overnight', price: 600, category: 'pakistani', image: '/items/pakistani/paya.png' }
];

export default menuItems;
