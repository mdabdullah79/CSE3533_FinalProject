// src/components/home/Testimonials.jsx
import { Star, Quote } from "lucide-react";
import { useState } from "react";

const Testimonials = () => {
   // Testimonials Data
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Fashion Enthusiast",
      image: "https://i.pravatar.cc/150?img=1",
      rating: 5,
      comment: "Amazing quality! The jacket I bought is even better than expected. Highly recommend Realm Wear!"
    },
    {
      id: 2,
      name: "Mike Chen",
      role: "Regular Customer",
      image: "https://i.pravatar.cc/150?img=3",
      rating: 5,
      comment: "Fast shipping and excellent customer service. My go-to store for premium fashion."
    },
    {
      id: 3,
      name: "Emma Davis",
      role: "Style Blogger",
      image: "https://i.pravatar.cc/150?img=5",
      rating: 5,
      comment: "Love the collection! Every piece is carefully curated and the quality is outstanding."
    }
  ];

  return (
   <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gray-50">
        <div className="lg:max-w-10/12 mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <span className="inline-block bg-amber-500 text-black px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
              Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              What Our Customers Say
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied customers who love our products
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.id}
                className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                {/* Stars */}
                <div className="flex text-amber-400 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400" />
                  ))}
                </div>
                
                {/* Comment */}
                <p className="text-sm sm:text-base text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.comment}"
                </p>
                
                {/* User Info */}
                <div className="flex items-center gap-3 sm:gap-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm sm:text-base">
                      {testimonial.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
  );
};

export default Testimonials;