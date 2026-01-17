// src/pages/Home.jsx
import { Link } from "react-router";
import Hero from "../components/Hero";
import FeaturedProducts from "../components/FeaturedProducts";
import Categories from "../components/Categories";
import Testimonials from "../components/Testimonials";
import Newsletter from "../components/Newsletter";
import WhyChooseUs from "../components/WhyChooseUs";
import InstagramFeed from "../components/InstagramFeed";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      <Hero />
     <FeaturedProducts />
     <Categories />
     <Testimonials />
     <Newsletter />
     <WhyChooseUs />
     <InstagramFeed />
    </div>
  );
};

export default Home;