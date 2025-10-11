import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AllProductPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-6 text-primary-600">All Products</h1>
        <p className="text-gray-700 text-lg mb-8">Browse our complete selection of fresh, healthy, and delicious products.</p>
        {/* Product grid or list will go here */}
        <div className="text-gray-400 italic">(Product listing coming soon...)</div>
      </div>
      <Footer />
    </main>
  );
}
