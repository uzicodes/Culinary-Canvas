'use client'
import Image from 'next/image'
import Link from 'next/link'

const categories = [
	{
		id: 1,
		name: 'Burgers',
		slug: 'burger',
		image: '/items/burger/classic.png',
		color: 'bg-red-100',
		textColor: 'text-red-600'
	},
	{
		id: 2,
		name: 'Pizza',
		slug: 'pizza',
		image: '/items/pizza/deluxe.png',
		color: 'bg-green-100',
		textColor: 'text-green-600'
	},
	{
		id: 3,
		name: 'Fast Foods',
		slug: 'fastfood',
		image: '/items/fastfood/fried_chicken.png',
		color: 'bg-blue-100',
		textColor: 'text-blue-600'
	},
	{
		id: 4,
		name: 'Set Menus',
		slug: 'setmenu',
		image: '/items/setmenu/1.png',
		color: 'bg-yellow-100',
		textColor: 'text-yellow-600'
	},
	{
		id: 5,
		name: 'Appetizers',
		slug: 'appetizers',
		image: '/items/appetizers/Dual Tacos.png',
		color: 'bg-purple-100',
		textColor: 'text-purple-600'
	},
	{
		id: 6,
		name: 'Chinese',
		slug: 'chinese',
		image: '/items/chinese/kung_pao.png',
		color: 'bg-blue-100',
		textColor: 'text-purple-600'
	},
	{
		id: 7,
		name: 'Desserts',
		slug: 'desserts',
		image: '/items/desserts/brownie.png',
		color: 'bg-blue-100',
		textColor: 'text-pink-600'
	},
	{
		id: 8,
		name: 'Italian',
		slug: 'italian',
		image: '/items/italian/spaghetti.png',
		color: 'bg-purple-100',
		textColor: 'text-orange-600'
	},
	{
		id: 9,
		name: 'Traditional',
		slug: 'traditional',
		image: '/items/traditional/butter.png',
		color: 'bg-red-100',
		textColor: 'text-green-600'
	},
	{
		id: 10,
		name: 'Coffee',
		slug: 'coffee',
		image: '/items/coffee/espresso.png',
		color: 'bg-green-100',
		textColor: 'text-purple-600'
	},
	{
		id: 11,
		name: 'Drinks & Beverages',
		slug: 'drinks',
		image: '/items/drinks/matcha.png',
		color: 'bg-red-100',
		textColor: 'text-purple-600'
	},
	{
		id: 12,
		name: 'Pakistani',
		slug: 'pakistani',
		image: '/items/pakistani/nihari.png',
		color: 'bg-green-100',
		textColor: 'text-green-700'
	}
]

const Categories = () => {
	return (
		<section className="py-16 bg-white">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				{/* Section Header */}
				<div className="text-center mb-12">
					<h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
						Browse Our Hottest{' '}
						<span className="text-primary-600">Categories</span>
					</h2>
				</div>

				{/* Categories Grid */}
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
					{categories.map((category) => (
						<Link
							key={category.id}
							href={`/all-items?category=${category.slug}`}
							className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
						>
							<div
								className={`${category.color} rounded-2xl p-6 text-center hover:shadow-lg transition-shadow`}
							>
								<div className="relative w-16 h-16 mx-auto mb-4">
									<Image
										src={category.image}
										alt={category.name}
										fill
										className="object-cover rounded-full"
									/>
								</div>
								<h3
									className={`font-semibold ${category.textColor} group-hover:scale-110 transition-transform ${category.id === 11 ? 'text-sm' : ''}`}
								>
									{category.name}
								</h3>
							</div>
						</Link>
					))}
				</div>
			</div>
		</section>
	)
}

export default Categories