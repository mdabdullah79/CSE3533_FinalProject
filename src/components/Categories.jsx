// src/components/home/Categories.jsx
import { Link } from "react-router";
import { Shirt, Watch, Headphones, Gem, ShoppingBag, TrendingUp } from "lucide-react";

const Categories = () => {
  const categories = [
    {
      id: 1,
      name: "Men's Fashion",
      description: "Modern & Trendy Wear",
      icon: <Shirt className="w-8 h-8" />,
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600",
      color: "from-blue-500 to-cyan-500",
      count: 124
    },
    {
      id: 2,
      name: "Women's Collection",
      description: "Elegant & Stylish",
      icon: <Gem className="w-8 h-8" />,
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600",
      color: "from-pink-500 to-rose-500",
      count: 98
    },
    {
      id: 3,
      name: "Electronics",
      description: "Latest Gadgets",
      icon: <Headphones className="w-8 h-8" />,
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=600",
      color: "from-purple-500 to-violet-500",
      count: 76
    },
    {
      id: 4,
      name: "Accessories",
      description: "Complete Your Look",
      icon: <Watch className="w-8 h-8" />,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600",
      color: "from-amber-500 to-orange-500",
      count: 56
    },
    {
      id: 5,
      name: "Home & Living",
      description: "Comfort Essentials",
      icon: <ShoppingBag className="w-8 h-8" />,
      image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=600",
      color: "from-emerald-500 to-teal-500",
      count: 89
    },
    {
      id: 6,
      name: "Sale & Offers",
      description: "Up to 70% Off",
      icon: <TrendingUp className="w-8 h-8" />,
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=600",
      color: "from-red-500 to-rose-500",
      count: "Special"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="lg:max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Shop By Categories
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our carefully curated collections designed to match your lifestyle
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/shop?category=${category.name}`}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              {/* Background Image with Overlay */}
              <div className="aspect-square overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${category.color} text-white`}>
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{category.name}</h3>
                    <p className="text-gray-200 text-sm">{category.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm">
                    {typeof category.count === 'number' ? `${category.count}+ Items` : category.count}
                  </span>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-black px-3 py-1 rounded-lg text-sm font-medium hover:bg-gray-100">
                    Shop Now
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;