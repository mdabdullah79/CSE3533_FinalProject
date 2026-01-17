// src/components/home/Newsletter.jsx
import { Mail, Gift, ShieldCheck, Truck } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      // toast.success(
      //   <div className="flex items-center gap-3">
      //     <Gift className="w-5 h-5 text-green-500" />
      //     <div>
      //       <p className="font-semibold">Welcome to Realm Wear!</p>
      //       <p className="text-sm text-gray-600">Check your email for 15% off coupon</p>
      //     </div>
      //   </div>
      // );
      setEmail("");
      setLoading(false);
    }, 1000);
  };

  return (
    <section className="py-16 bg-gradient-to-r from-gray-900 to-black text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full blur-3xl" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4 relative">
              Stay in the Loop
            </h2>
            <p className="text-gray-300 mb-6 text-lg relative">
              Subscribe to our newsletter and be the first to know about exclusive deals, new arrivals, and style tips.
            </p>

            {/* Benefits */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { icon: <Gift className="w-5 h-5" />, text: "Exclusive Discounts" },
                { icon: <ShieldCheck className="w-5 h-5" />, text: "Early Access" },
                { icon: <Truck className="w-5 h-5" />, text: "Free Shipping Offers" },
                { icon: <Mail className="w-5 h-5" />, text: "Style Guides" }
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg">
                    {benefit.icon}
                  </div>
                  <span className="text-sm">{benefit.text}</span>
                </div>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="relative">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-70"
                >
                  {loading ? "Subscribing..." : "Subscribe"}
                </button>
              </div>
              <p className="text-gray-400 text-sm mt-3">
                By subscribing, you agree to our Privacy Policy and consent to receive updates.
              </p>
            </form>
          </div>

          {/* Right Image/Illustration */}
          <div className="relative">
            <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl" />
            <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 shadow-2xl">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { discount: "15%", text: "First Order" },
                  { discount: "Free", text: "Shipping" },
                  { discount: "Extra", text: "10% Off" },
                  { discount: "VIP", text: "Access" }
                ].map((offer, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-4 text-center hover:border-amber-500/50 transition-colors"
                  >
                    <div className="text-2xl font-bold text-amber-400 mb-1">{offer.discount}</div>
                    <div className="text-sm text-gray-300">{offer.text}</div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full">
                  <Gift className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-300 font-medium">Limited Time Offers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;