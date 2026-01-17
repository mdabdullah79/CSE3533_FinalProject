// src/pages/Login.jsx
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link, useLocation } from "react-router";
import toast from "react-hot-toast";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  ShoppingBag,
  ArrowRight,
  Sparkles,
  CheckCircle,
} from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect path from state or localStorage
  const redirectPath = location.state?.from || localStorage.getItem('redirectAfterLogin') || "/";

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      // toast.success("Welcome back! Login successful");
      
      // Clear redirect storage
      localStorage.removeItem('redirectAfterLogin');
      
      // Navigate to redirect path
      setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 500);
    } catch (error) {
      toast.error(error.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      // toast.success("Google login successful!");
      localStorage.removeItem('redirectAfterLogin');
      setTimeout(() => navigate(redirectPath, { replace: true }), 500);
    } catch (error) {
      toast.error(error.message || "Google login failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Left Column - Login Form */}
        <div className="p-8 md:p-12 lg:p-16">
          <div className="max-w-md mx-auto">
            {/* Header */}
            <div className="mb-10">
              <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
                <div className="w-10 h-10 bg-gradient-to-br from-black to-gray-800 rounded-lg flex items-center justify-center group-hover:rotate-6 transition-transform">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">Realm Wear</span>
              </Link>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Welcome Back
              </h1>
              <p className="text-gray-600">
                Sign in to your account to continue shopping
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Submit */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-5 h-5 text-black border-gray-300 rounded focus:ring-black"
                  />
                  <span className="text-sm text-gray-700">Remember me</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-black to-gray-800 text-white py-4 rounded-xl font-bold hover:from-gray-800 hover:to-black transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Sign In
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-8">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="px-4 text-sm text-gray-500">Or continue with</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Social Login Buttons */}
            <div className="w-full mb-8">
              <button
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className="flex items-center justify-center gap-3 p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-70 w-full cursor-pointer"
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-6 h-6" />
                <span className="hidden sm:inline font-medium">Google</span>
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link 
                  to="/signup" 
                  className="text-black font-bold hover:text-gray-800 transition-colors inline-flex items-center gap-1"
                >
                  Sign up now
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </p>
            </div>

            {/* Terms */}
            <p className="text-xs text-gray-500 text-center mt-8">
              By signing in, you agree to our{" "}
              <Link to="/terms" className="text-gray-700 hover:text-black underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-gray-700 hover:text-black underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>

        {/* Right Column - Branding & Benefits */}
        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-black to-gray-900 text-white p-12 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full -translate-x-48 translate-y-48"></div>
          
          <div className="relative z-10">
            {/* Benefits List */}
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span className="text-amber-300 font-medium">Exclusive Benefits</span>
              </div>
              
              <h2 className="text-3xl font-bold mb-8">
                Why Join Realm Wear?
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Early Access</h3>
                    <p className="text-gray-300">Get first dibs on new collections and limited editions</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Member Discounts</h3>
                    <p className="text-gray-300">Enjoy exclusive discounts and special offers</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Fast Checkout</h3>
                    <p className="text-gray-300">Save your details for quicker, hassle-free shopping</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Order Tracking</h3>
                    <p className="text-gray-300">Track all your orders in one place</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src="https://plus.unsplash.com/premium_vector-1683141132250-12daa3bd85cf?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Customer"
                  className="w-12 h-12 rounded-full border-2 border-white"
                />
                <div>
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-gray-300 text-sm">Fashion Blogger</p>
                </div>
              </div>
              <p className="text-gray-200 italic">
                "Realm Wear has transformed my shopping experience. The quality is unmatched and the customer service is exceptional!"
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="relative z-10 grid grid-cols-3 gap-4 pt-8 border-t border-white/20">
            <div className="text-center">
              <div className="text-2xl font-bold">10K+</div>
              <div className="text-sm text-gray-300">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">4.9</div>
              <div className="text-sm text-gray-300">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">24h</div>
              <div className="text-sm text-gray-300">Fast Support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;