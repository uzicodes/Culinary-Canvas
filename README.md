# 🍃 Culinary Canvas - Fresh Food Delivery Platform

> **Choose delicacy the best healthy way to life**

A modern, responsive food delivery web application built with Next.js, TypeScript, and Tailwind CSS. This platform specializes in delivering fresh, organic, and healthy food products directly to customers' doorsteps.

[![Live Demo](https://img.shields.io/badge/demo-live-green.svg)](https://culinary-canvas.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-uzicodes-blue)](https://github.com/uzicodes/Culinary-Canvas)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC)](https://tailwindcss.com/)

![Culinary Canvas](https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80)

## ✨ Features

- 🌱 **Fresh & Organic Products** - Curated selection of organic fruits, vegetables, and healthy food items
- 📱 **Responsive Design** - Optimized for desktop, tablet, and mobile devices  
- 🛒 **Shopping Cart** - Easy-to-use shopping cart with quantity management
- ⭐ **Product Reviews** - Customer ratings and reviews for all products
- 🚚 **Fast Delivery** - Same-day delivery within the city
- 👤 **User Authentication** - Secure user registration and login (UI ready)
- 📰 **Blog Section** - Health tips, recipes, and organic food insights
- 💳 **Secure Checkout** - Multiple payment options with secure processing (UI ready)
- 📊 **Statistics Dashboard** - Company performance metrics
- 💬 **Customer Testimonials** - Real customer feedback and reviews
- 📱 **Mobile App Promotion** - Download links for iOS and Android
- 🌐 **SEO Optimized** - Built with Next.js for excellent SEO performance

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Image Optimization**: Next.js Image component
- **Font**: Inter (Google Fonts)
- **Package Manager**: npm

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Git

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/uzicodes/Culinary-Canvas.git
cd Culinary-Canvas
```

2. **Install dependencies:**
```bash
npm install
# or
yarn install
```

3. **Run the development server:**
```bash
npm run dev
# or
yarn dev
```

4. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
Culinary-Canvas/
├── 📁 public/                    # Static assets
├── 📁 src/
│   ├── 📁 app/
│   │   ├── 🎨 globals.css        # Global styles with Tailwind
│   │   ├── ⚙️ layout.tsx         # Root layout component
│   │   └── 🏠 page.tsx           # Main homepage
│   ├── 📁 components/            # React components
│   │   ├── 🧭 Header.tsx         # Navigation header
│   │   ├── 🎯 Hero.tsx           # Hero section with CTA
│   │   ├── 🏷️ Categories.tsx     # Product categories
│   │   ├── 🏆 BestSelling.tsx    # Best selling products
│   │   ├── ℹ️ About.tsx          # About/features section
│   │   ├── ⭐ PopularProducts.tsx # Popular products grid
│   │   ├── 📊 Stats.tsx          # Statistics section
│   │   ├── 💬 Testimonials.tsx   # Customer reviews
│   │   ├── 📱 Newsletter.tsx     # Mobile app promotion
│   │   ├── 📝 Blog.tsx           # Latest news & blogs
│   │   └── 🦶 Footer.tsx         # Site footer
│   ├── 📁 lib/
│   │   └── 🔧 utils.ts           # Utility functions
│   └── 📁 types/
│       └── 📋 index.ts           # TypeScript type definitions
├── ⚙️ Configuration files:
│   ├── 📦 package.json           # Dependencies & scripts
│   ├── 🎨 tailwind.config.js     # Tailwind CSS config
│   ├── 📘 tsconfig.json          # TypeScript config
│   ├── ⚡ next.config.js         # Next.js config
│   └── 🎯 postcss.config.js      # PostCSS config
└── 📖 README.md                  # Project documentation
```

## 🎯 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code linting

## 🧩 Components Overview

### Core Components

| Component | Description |
|-----------|-------------|
| **Header** | Navigation bar with menu, search, and cart functionality |
| **Hero** | Main banner with call-to-action and featured content |
| **Categories** | Product category showcase with hover effects |
| **BestSelling** | Featured best-selling products grid |
| **About** | Company information and features section |
| **PopularProducts** | Extended product showcase with ratings |
| **Stats** | Company statistics and achievements |
| **Testimonials** | Customer reviews and feedback |
| **Newsletter** | Mobile app promotion and download links |
| **Blog** | Latest articles and health tips |
| **Footer** | Comprehensive site links and contact info |

### 🎨 Styling Features

- ✅ Fully responsive design using Tailwind CSS
- ✅ Custom color palette with primary green and orange accents
- ✅ Smooth hover animations and transitions
- ✅ Modern gradient backgrounds and shadows
- ✅ Optimized typography with Inter font family
- ✅ Mobile-first approach
- ✅ Dark mode ready (can be easily implemented)

## 🎨 Customization

### Colors

The color scheme can be customized in `tailwind.config.js`:

```javascript
colors: {
  primary: {
    50: '#f0fdf4',
    500: '#22c55e', // Main green
    600: '#16a34a',
    // ... other shades
  },
  orange: {
    500: '#f97316', // Accent orange
    // ... other shades
  }
}
```

### Typography

Font family and sizes can be adjusted in the Tailwind configuration and global CSS.

## 🚀 Deployment

The application can be deployed on various platforms:

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure build settings (Next.js is auto-detected)
3. Deploy with automatic CI/CD

### Other Platforms
- **Netlify**
- **AWS Amplify**
- **Railway**
- **Heroku**

## 🔄 Future Enhancements

### Backend Integration (MERN Stack Completion)
- [ ] **MongoDB Database** - Product, user, and order data
- [ ] **Express.js API** - RESTful APIs for all operations
- [ ] **Authentication** - JWT-based user authentication
- [ ] **Payment Integration** - Stripe/PayPal for secure payments
- [ ] **Admin Dashboard** - Product and order management
- [ ] **Real-time Updates** - Socket.io for live order tracking

### Additional Features
- [ ] **Shopping Cart Persistence** - Local storage and database sync
- [ ] **Wishlist Functionality** - Save favorite products
- [ ] **Advanced Search** - Filter by price, category, ratings
- [ ] **User Profiles** - Order history and preferences
- [ ] **Push Notifications** - Order updates and promotions
- [ ] **Multi-language Support** - i18n implementation
- [ ] **Analytics Dashboard** - User behavior tracking

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Uzi Codes**
- GitHub: [@uzicodes](https://github.com/uzicodes)
- Repository: [Culinary-Canvas](https://github.com/uzicodes/Culinary-Canvas)

## 🙏 Acknowledgments

- Images from [Unsplash](https://unsplash.com)
- Icons from [Lucide](https://lucide.dev)
- Design inspiration from modern food delivery platforms
- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

## 📞 Support

For support, email support@culinarycanvas.com or create an issue in this repository.

---

⭐ **If you like this project, please give it a star on GitHub!** ⭐