import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Categories from '@/components/Categories'
import BestSelling from '@/components/BestSelling'
import About from '@/components/About'
import Stats from '@/components/Stats'
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
      <Stats />
      <Blog />
      <Footer />
    </main>
  )
}