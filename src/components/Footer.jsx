// src/components/layout/Footer.jsx
import { Link } from "react-router";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard, 
  ShieldCheck, 
  Truck, 
  RefreshCw,
  Heart,
  ArrowRight,
  Send,
  Store,
  Users,
  Award
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    toast.success(
      <div className="flex items-center gap-3">
        <Mail className="w-5 h-5 text-green-500" />
        <div>
          <p className="font-semibold">Subscribed Successfully!</p>
          <p className="text-sm text-gray-600">Check your email for welcome offer</p>
        </div>
      </div>
    );
    setEmail("");
  };

  const quickLinks = [
    { name: "New Arrivals", path: "/shop?filter=new" },
    { name: "Best Sellers", path: "/shop?filter=bestsellers" },
    { name: "Sale & Offers", path: "/shop?filter=sale" },
    { name: "Men's Collection", path: "/shop?category=Men" },
    { name: "Women's Collection", path: "/shop?category=Women" },
    { name: "Accessories", path: "/shop?category=Accessories" },
  ];

  const companyLinks = [
    { name: "About Us", path: "/about" },
    { name: "Our Story", path: "/story" },
    { name: "Careers", path: "/careers" },
    { name: "Press & Media", path: "/press" },
    { name: "Blog", path: "/blog" },
    { name: "Sustainability", path: "/sustainability" },
  ];

  const supportLinks = [
    { name: "Help Center", path: "/help" },
    { name: "Track Order", path: "/track-order" },
    { name: "Size Guide", path: "/size-guide" },
    { name: "Returns & Exchanges", path: "/returns" },
    { name: "Shipping Info", path: "/shipping" },
    { name: "Contact Us", path: "/contact" },
  ];

  const paymentMethods = [
    { name: "Visa", icon: "💳" },
    { name: "Mastercard", icon: "💳" },
    { name: "PayPal", icon: "🔵" },
    { name: "Apple Pay", icon: "🍎" },
    { name: "Google Pay", icon: "G" },
    { name: "Cash on Delivery", icon: "💰" },
  ];

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, name: "Facebook", url: "https://facebook.com" },
    { icon: <Instagram className="w-5 h-5" />, name: "Instagram", url: "https://instagram.com" },
    { icon: <Twitter className="w-5 h-5" />, name: "Twitter", url: "https://twitter.com" },
    { icon: <Youtube className="w-5 h-5" />, name: "YouTube", url: "https://youtube.com" },
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Trust Badges */}
      <div className="border-b border-gray-800">
        <div className="lg:max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <ShieldCheck className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="font-semibold">Secure Shopping</p>
                <p className="text-sm text-gray-400">SSL Protected</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Truck className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="font-semibold">Free Shipping</p>
                <p className="text-sm text-gray-400">Over $100</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <RefreshCw className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="font-semibold">Easy Returns</p>
                <p className="text-sm text-gray-400">30 Day Policy</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Award className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <p className="font-semibold">Best Price</p>
                <p className="text-sm text-gray-400">Guaranteed</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="lg:max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <Store className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">Realm Wear</span>
              </Link>
              <p className="text-gray-400 mt-3 max-w-md">
                Premium fashion and lifestyle destination offering curated collections that blend style, comfort, and quality for the modern individual.
              </p>
            </div>

            {/* Newsletter Subscription */}
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-3">Stay Updated</h3>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <div className="flex-1 relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Subscribe</span>
                </button>
              </form>
              <p className="text-gray-500 text-sm mt-2">
                Subscribe to get special offers and updates
              </p>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="font-bold text-lg mb-3">Follow Us</h3>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors group"
                    aria-label={social.name}
                  >
                    <div className="group-hover:scale-110 transition-transform">
                      {social.icon}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              Shop
              <ArrowRight className="w-4 h-4" />
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-amber-500 transition-all"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Company
            </h3>
            <ul className="space-y-2">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-blue-500 transition-all"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              Support
            </h3>
            <ul className="space-y-2">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-green-500 transition-all"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Contact Info */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400">support@realmwear.com</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                <span className="text-gray-400">123 Fashion Street, New York, NY 10001</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            We Accept
          </h3>
          <div className="flex flex-wrap gap-3">
            {paymentMethods.map((method, index) => (
              <div
                key={index}
                className="px-4 py-2 bg-gray-800 rounded-lg flex items-center gap-2"
              >
                <span>{method.icon}</span>
                <span className="text-sm">{method.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Realm Wear. All rights reserved.
            </div>
            
            <div className="flex items-center gap-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </Link>
              <Link to="/sitemap" className="text-gray-400 hover:text-white transition-colors">
                Sitemap
              </Link>
            </div>
            
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> by Realm Wear Team
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 p-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 z-50"
        aria-label="Back to top"
      >
        <ArrowRight className="w-5 h-5 rotate-270" />
      </button>
    </footer>
  );
};

export default Footer;