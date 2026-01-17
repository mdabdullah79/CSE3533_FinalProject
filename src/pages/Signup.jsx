// src/pages/Signup.jsx
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router";
import toast from "react-hot-toast";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  CheckCircle,
  XCircle,
  ShoppingBag,
  Facebook,
  Github,
  ArrowRight,
  Sparkles,
  UserPlus
} from "lucide-react";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [errors, setErrors] = useState({});

  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  // Password strength checker
  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    setPasswordStrength(strength);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }

    // Check password strength
    if (name === 'password') {
      checkPasswordStrength(value);
    }

    // Validate passwords match
    if (name === 'confirmPassword' || name === 'password') {
      if (formData.password && formData.confirmPassword) {
        if (formData.password !== formData.confirmPassword) {
          setErrors(prev => ({ 
            ...prev, 
            confirmPassword: "Passwords do not match" 
          }));
        } else {
          setErrors(prev => ({ ...prev, confirmPassword: "" }));
        }
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSignup = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) {
    toast.error("Please fix the errors in the form");
    return;
  }

  setLoading(true);
  try {
    await signup(formData.email, formData.password, formData.fullName);
    
    // toast.success(
    //   <div className="flex items-center gap-3">
    //     <Sparkles className="w-5 h-5 text-green-500" />
    //     <div>
    //       <p className="font-semibold">Account created successfully!</p>
    //       <p className="text-sm text-gray-600">Welcome to Realm Wear</p>
    //     </div>
    //   </div>
    // );
    
    setTimeout(() => {
      navigate("/");
    }, 1000);
    
  } catch (error) {
    // console.error("Signup error:", error);
    
    let errorMessage = "Signup failed";
    
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = "This email is already registered. Please login instead.";
      
      // Option: Redirect to login page
      toast.error(errorMessage, {
        duration: 4000,
        action: {
          label: 'Login',
          onClick: () => navigate("/login")
        }
      });
      
    } else if (error.code === 'auth/weak-password') {
      errorMessage = "Password is too weak. Please use at least 8 characters with uppercase, lowercase, numbers and symbols.";
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = "Invalid email address.";
    } else if (error.message?.includes("already registered")) {
      errorMessage = error.message;
      toast.error(errorMessage, {
        duration: 4000,
        action: {
          label: 'Login',
          onClick: () => navigate("/login")
        }
      });
    } else {
      toast.error(errorMessage);
    }
  } finally {
    setLoading(false);
  }
};

  const handleGoogleSignup = async () => {
    try {
      await loginWithGoogle();
      // toast.success("Account created with Google!");
      setTimeout(() => navigate("/"), 500);
    } catch (error) {
      toast.error(error.message || "Google signup failed");
    }
  };


  const getStrengthColor = () => {
    if (passwordStrength >= 75) return "bg-green-500";
    if (passwordStrength >= 50) return "bg-yellow-500";
    if (passwordStrength >= 25) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 py-12">
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          
          {/* Left Column - Form */}
          <div className="p-8 md:p-12">
            <div className="max-w-md mx-auto">
              {/* Header */}
              <div className="mb-8">
                <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
                  <div className="w-10 h-10 bg-gradient-to-br from-black to-gray-800 rounded-lg flex items-center justify-center group-hover:rotate-6 transition-transform">
                    <ShoppingBag className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">Realm Wear</span>
                </Link>
                
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                  Create Account
                </h1>
                <p className="text-gray-600">
                  Join thousands of happy customers
                </p>
              </div>

              {/* Signup Form */}
              <form onSubmit={handleSignup} className="space-y-5">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition ${
                        errors.fullName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <XCircle className="w-4 h-4" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a strong password"
                      className={`w-full pl-12 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  
                  {/* Password Strength */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">Password strength</span>
                        <span className="text-sm font-medium">
                          {passwordStrength >= 75 ? "Strong" : 
                           passwordStrength >= 50 ? "Good" : 
                           passwordStrength >= 25 ? "Fair" : "Weak"}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                          style={{ width: `${passwordStrength}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <XCircle className="w-4 h-4" />
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      className="w-full pl-12 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition "
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Terms & Conditions */}
                <div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      className="w-5 h-5 text-black border-gray-300 rounded focus:ring-black mt-1"
                    />
                    <span className="text-sm text-gray-700">
                      I agree to the{" "}
                      <Link to="/terms" className="text-black font-medium hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy" className="text-black font-medium hover:underline">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                  {errors.agreeToTerms && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <XCircle className="w-4 h-4" />
                      {errors.agreeToTerms}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-black to-gray-800 text-white py-4 rounded-xl font-bold hover:from-gray-800 hover:to-black transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      Create Account
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center my-8">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="px-4 text-sm text-gray-500">Or sign up with</span>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>

              {/* Social Signup Buttons */}
              <div className="w-full mb-8">
                <button
                  onClick={handleGoogleSignup}
                  className="flex items-center justify-center gap-3 p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors w-full cursor-pointer"
                >
                  <img src="https://www.google.com/favicon.ico" alt="Google" className="w-6 h-6" />
                  <span className="hidden sm:inline font-medium">Google</span>
                </button>
            
              </div>

              {/* Login Link */}
              <div className="text-center">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Link 
                    to="/login" 
                    className="text-black font-bold hover:text-gray-800 transition-colors inline-flex items-center gap-1"
                  >
                    Sign in now
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Benefits */}
          <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-black to-gray-900 text-white p-12 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-48 translate-y-48"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <span className="text-yellow-100 font-medium">Member Benefits</span>
              </div>
              
              <h2 className="text-3xl font-bold mb-8">
                Join Our Community
              </h2>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2">Welcome Offer</h3>
                    <p className="text-white/80">Get 15% off your first purchase</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2">Free Shipping</h3>
                    <p className="text-white/80">Free delivery on orders over $100</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2">Priority Support</h3>
                    <p className="text-white/80">24/7 dedicated customer support</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2">Exclusive Access</h3>
                    <p className="text-white/80">Early access to sales and new collections</p>
                  </div>
                </div>
              </div>

              {/* Testimonial */}
              <div className="mt-12 pt-8 border-t border-white/30">
                <p className="text-lg italic mb-4">
                  "Signing up was the best decision! The exclusive deals alone are worth it."
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100"
                    alt="Customer"
                    className="w-10 h-10 rounded-full border-2 border-white"
                  />
                  <div>
                    <h4 className="font-semibold">Alex Morgan</h4>
                    <p className="text-white/70 text-sm">Verified Customer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;