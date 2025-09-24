'use client'

const Stats = () => {
  const stats = [
    { number: '1,500+', label: 'Happy Customers', icon: '👥' },
    { number: '300+', label: 'Products Available', icon: '🛒' },
    { number: '30+', label: 'Years Experience', icon: '⭐' },
    { number: '1,800+', label: 'Orders Delivered', icon: '🚚' }
  ]

  return (
    <section className="py-16 bg-primary-600">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center text-white">
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-3xl lg:text-4xl font-bold mb-2">{stat.number}</div>
              <div className="text-lg opacity-90">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Stats