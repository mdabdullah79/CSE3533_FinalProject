// src/components/home/WhyChooseUs.jsx
import { ShieldCheck, Truck, RefreshCw, CreditCard, Headphones, Award } from "lucide-react";

const WhyChooseUs = () => {
  const features = [
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: "Quality Guaranteed",
      description: "Every product is carefully selected and quality-checked before shipping.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Fast & Free Shipping",
      description: "Free shipping on orders over $100. Delivery within 3-5 business days.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <RefreshCw className="w-8 h-8" />,
      title: "Easy Returns",
      description: "30-day hassle-free return policy. We make returns simple and convenient.",
      color: "from-purple-500 to-violet-500"
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "Secure Payment",
      description: "Multiple payment options with bank-level security for safe transactions.",
      color: "from-amber-500 to-orange-500"
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: "24/7 Support",
      description: "Our customer support team is always ready to help you with any queries.",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Award Winning",
      description: "Recognized as one of the best online stores for customer satisfaction.",
      color: "from-red-500 to-pink-500"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="lg:max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Why Choose Realm Wear
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're committed to providing the best shopping experience with premium quality products and exceptional service.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-gray-50 rounded-2xl p-6 hover:bg-white hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              {/* Animated Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />
              
              {/* Icon */}
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} text-white mb-4`}>
                {feature.icon}
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
              
              {/* Hover Effect Line */}
              <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 group-hover:w-24 h-0.5 bg-gradient-to-r ${feature.color} transition-all duration-300`} />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 bg-gradient-to-r from-gray-900 to-black rounded-3xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Ready to Experience the Difference?</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have made Realm Wear their go-to destination for premium products.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition-all">
              Start Shopping
            </button>
            <button className="px-8 py-3 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;