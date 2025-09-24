import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Categories from '@/components/Categories'
import BestSelling from '@/components/BestSelling'
import About from '@/components/About'
import PopularProducts from '@/components/PopularProducts'
import Stats from '@/components/Stats'
import Testimonials from '@/components/Testimonials'
import Newsletter from '@/components/Newsletter'
import Blog from '@/components/Blog'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Categories />
      <BestSelling />
      <About />
      <PopularProducts />
      <Stats />
      <Testimonials />
      <Newsletter />
      <Blog />
      <Footer />
    </main>
  )
}