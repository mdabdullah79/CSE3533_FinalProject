// src/components/Hero.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ArrowRight, Star, Truck, Shield, ChevronLeft, ChevronRight } from "lucide-react"; 

const Hero = () => {
  const heroImages = [
    "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1578932750294-f5075e85f44a?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1598775378121-e24f7062c151?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1625698311031-f0dd15be5144?auto=format&fit=crop&w=1600&q=80"
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative">
      {/* Hero Slider */}
      <section className="relative min-h-[500px] sm:min-h-[600px] md:min-h-[700px] lg:min-h-[800px] bg-cover bg-center flex items-center overflow-hidden">
        {/* Background Images with Slides */}
        {heroImages.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            style={{ backgroundImage: `url(${img})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
          </div>
        ))}
        
        {/* Content */}
        <div className="relative lg:max-w-10/12 mx-auto px-3 sm:px-4 md:px-6 lg:px-8 w-full">
          <div className="max-w-full sm:max-w-4xl text-white">
            <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6">
              🎉 Winter Sale: Up to 50% Off
            </span>
            
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
              Elevate Your Style with{" "}
              <span className="text-amber-400">Premium</span> Fashion
            </h1>
            
            <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 text-gray-200 max-w-full sm:max-w-xl">
              Discover curated collections of jackets, hoodies, and accessories 
              designed for comfort, style, and confidence in every season.
            </p>
            
            {/* বাটন একদম আগের মতো রাখলাম */}
            <div className="flex gap-3 sm:gap-4 mb-8 sm:mb-10">
              <Link to="/shop" className="">
                <button className="group bg-amber-500 hover:bg-amber-600 text-black px-4 sm:px-8 py-2 sm:py-4 rounded-lg font-bold text-base sm:text-lg flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-amber-500/30 ">
                  Start Shopping
                  <ArrowRight className="group-hover:translate-x-1 transition-transform h-4 w-4 sm:h-5 sm:w-5" /> 
                </button>
              </Link>
              <Link to="/new-arrivals" className="">
                <button className="group border-2 border-white/50 hover:border-white text-white px-4 sm:px-8 py-2 sm:py-4 rounded-lg font-bold text-base sm:text-lg backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                  New Arrivals
                </button>
              </Link>
            </div>
            
            {/* Stats */}
            <div className="flex flex-col xs:flex-row flex-wrap gap-3 xs:gap-4 sm:gap-6 md:gap-8">
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 fill-amber-400 stroke-amber-400" /> 
                  ))}
                </div>
                <span className="text-xs sm:text-sm">4.9/5 <span className="hidden sm:inline">(10K+ Reviews)</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 sm:h-5 sm:w-5" /> 
                <span className="text-xs sm:text-sm">Free Shipping <span className="hidden xs:inline">Over $50</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5" /> 
                <span className="text-xs sm:text-sm">1-Year Warranty</span>
              </div>
            </div>
          </div>
        </div>

        {/* Slider Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 z-10"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 z-10"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        {/* Slider Dots */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 sm:gap-3 z-10">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 w-2 sm:h-3 sm:w-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? "bg-amber-400 scale-125" 
                  : "bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="hidden sm:block absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
          <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-2 sm:h-3 bg-white/70 rounded-full mt-2"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;