// src/components/Navbar.jsx
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../context/CartContext";
import { useWishlistCount } from "../hooks/useWishlistCount";
import { 
  ShoppingCart, 
  LogOut, 
  User, 
  Menu, 
  X, 
  Home, 
  Store, 
  Shield, 
  ChevronDown,
  Heart,
  Package,
  Lock,
  AlertCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { wishlistManager } from "../utils/wishlistManager";

const Navbar = () => {
  const { currentUser, role, logout, photoURL } = useAuth();
  const { itemCount } = useCart();
  const { wishlistCount, refreshWishlistCount } = useWishlistCount();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [localWishlistCount, setLocalWishlistCount] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Detect scroll for navbar effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setShowProfileMenu(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileMenu && !event.target.closest('.profile-menu-container')) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showProfileMenu]);

  useEffect(() => {
    // Initial count
    if (currentUser) {
      const count = wishlistManager.getWishlistCount(currentUser.email);
      setLocalWishlistCount(count);
    }

    // Subscribe to wishlist updates
    const unsubscribe = wishlistManager.addListener(() => {
      if (currentUser) {
        const count = wishlistManager.getWishlistCount(currentUser.email);
        setLocalWishlistCount(count);
      }
    });

    // Listen for custom events
    const handleWishlistEvent = () => {
      refreshWishlistCount();
    };

    window.addEventListener('wishlist-updated', handleWishlistEvent);
    window.addEventListener('wishlistChanged', handleWishlistEvent);

    // Make refresh function available globally
    window.updateNavbarWishlist = refreshWishlistCount;

    return () => {
      unsubscribe();
      window.removeEventListener('wishlist-updated', handleWishlistEvent);
      window.removeEventListener('wishlistChanged', handleWishlistEvent);
      delete window.updateNavbarWishlist;
    };
  }, [currentUser, refreshWishlistCount]);
  
  // Use the maximum of hook count and local count
  const displayWishlistCount = Math.max(wishlistCount, localWishlistCount);

  const getInitial = () => {
    if (!currentUser) return "";
    if (currentUser.displayName) return currentUser.displayName.charAt(0).toUpperCase();
    return currentUser.email.charAt(0).toUpperCase();
  };

  const getUserName = () => {
    if (!currentUser) return "";
    if (currentUser.displayName) return currentUser.displayName;
    return currentUser.email.split('@')[0];
  };

  const handleProtectedRouteClick = (e, route) => {
    if (!currentUser) {
      e.preventDefault();
      setShowLoginModal(true);
      localStorage.setItem('redirectAfterLogin', route);
    }
  };

  const navLinks = [
    { path: "/", label: "Home", icon: <Home className="w-4 h-4" />, protected: false },
    { path: "/shop", label: "Shop", icon: <Store className="w-4 h-4" />, protected: false },
  ];

  // Add admin link if user is admin
  if (role === 'admin') {
    navLinks.push({ 
      path: "/admin", 
      label: "Admin Panel", 
      icon: <Shield className="w-4 h-4" />,
      protected: true 
    });
  }
  
  navLinks.push({ 
    path: "/orders", 
    label: "My Orders", 
    icon: <Package className="w-4 h-4" />,
    protected: true 
  });

  const handleLoginAndRedirect = () => {
    const redirectPath = localStorage.getItem('redirectAfterLogin') || '/orders';
    localStorage.removeItem('redirectAfterLogin');
    setShowLoginModal(false);
    navigate('/signup', { state: { from: redirectPath } });
  };

  return (
    <>
      {/* Navbar */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-lg py-2 sm:py-3' 
          : 'bg-white/90 backdrop-blur-md shadow-sm py-3 sm:py-4'
      }`}>
        <div className="lg:max-w-10/12 mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-1.5 sm:space-x-2 group flex-shrink-0">
              <div className="relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-black to-gray-800 rounded-lg flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300">
                  <span className="text-white font-bold text-lg sm:text-xl">R</span>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-black to-gray-800 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
              </div>
              <div className="">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
                  Realm Wear
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">Premium Fashion</p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <div key={link.path} className="relative">
                  {link.protected && !currentUser ? (
                    <button
                      onClick={(e) => handleProtectedRouteClick(e, link.path)}
                      className="relative flex items-center space-x-2 px-3 lg:px-4 py-2 rounded-lg transition-all duration-200 group text-gray-600 hover:text-black cursor-pointer"
                    >
                      {link.icon}
                      <span className="text-sm lg:text-base">{link.label}</span>
                      <div className="absolute inset-0 bg-gray-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10"></div>
                    </button>
                  ) : (
                    <Link
                      to={link.path}
                      className={`relative flex items-center space-x-2 px-3 lg:px-4 py-2 rounded-lg transition-all duration-200 group ${
                        location.pathname === link.path
                          ? 'text-black font-semibold'
                          : 'text-gray-600 hover:text-black'
                      }`}
                    >
                      {link.icon}
                      <span className="text-sm lg:text-base">{link.label}</span>
                      
                      {/* Active indicator */}
                      {location.pathname === link.path && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-black rounded-full"></div>
                      )}
                      
                      {/* Hover effect */}
                      <div className="absolute inset-0 bg-gray-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10"></div>
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-4">
              {/* Wishlist Icon */}
              {currentUser ? (
                <Link 
                  to="/wishlist" 
                  className="relative p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 group"
                  title="My Wishlist"
                >
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-red-500 transition-colors" />
                  {displayWishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white text-[10px] sm:text-xs rounded-full flex items-center justify-center font-medium">
                      {displayWishlistCount > 9 ? '9+' : displayWishlistCount}
                    </span>
                  )}
                </Link>
              ) : (
                <button
                  onClick={(e) => handleProtectedRouteClick(e, '/wishlist')}
                  className="relative p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 group"
                  title="My Wishlist"
                >
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-red-500 transition-colors" />
                </button>
              )}

              {/* Cart Icon */}
              <Link 
                to="/checkout" 
                className="relative p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 group" 
                title="My Cart"
              >
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:scale-110 transition-transform" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-black text-white text-[10px] sm:text-xs rounded-full flex items-center justify-center font-medium">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </Link>

              {/* Auth Section - Desktop */}
              {currentUser ? (
                <div className="profile-menu-container relative hidden sm:block">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center space-x-1 sm:space-x-2 pl-2 sm:pl-3 pr-1 sm:pr-2 py-1 sm:py-1.5 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors duration-200 border border-gray-200 group"
                  >
                    {photoURL ? (
                      <img
                        src={photoURL}
                        alt="profile"
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-white group-hover:ring-gray-200 transition-all"
                      />
                    ) : (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-black to-gray-700 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">
                        {getInitial()}
                      </div>
                    )}
                    
                    <div className="hidden lg:block text-left">
                      <p className="text-sm font-medium text-gray-900 truncate max-w-[120px]">{getUserName()}</p>
                      <p className="text-xs text-gray-500 capitalize">{role}</p>
                    </div>
                    
                    <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-500 transition-transform duration-200 ${
                      showProfileMenu ? 'rotate-180' : ''
                    }`} />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-52 sm:w-56 bg-white rounded-xl shadow-lg border py-2 z-50 animate-fadeIn">
                      {/* User Info */}
                      <div className="px-3 sm:px-4 py-2 sm:py-3 border-b">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          {photoURL ? (
                            <img
                              src={photoURL}
                              alt="profile"
                              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-black to-gray-700 text-white rounded-full flex items-center justify-center text-base sm:text-lg font-bold">
                              {getInitial()}
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-900 text-sm truncate">{getUserName()}</p>
                            <p className="text-xs sm:text-sm text-gray-500 capitalize">{role}</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          to="/orders"
                          className="flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <Package className="w-4 h-4" />
                          <span>My Orders</span>
                        </Link>

                        <Link
                          to="/wishlist"
                          className="flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <Heart className="w-4 h-4" />
                          <span>My Wishlist</span>
                          {displayWishlistCount > 0 && (
                            <span className="ml-auto bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">
                              {displayWishlistCount}
                            </span>
                          )}
                        </Link>

                        {role === 'admin' && (
                          <Link
                            to="/admin"
                            className="flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors border-t mt-2 pt-2"
                            onClick={() => setShowProfileMenu(false)}
                          >
                            <Shield className="w-4 h-4" />
                            <span>Admin Panel</span>
                          </Link>
                        )}
                      </div>

                      {/* Logout Button */}
                      <div className="border-t pt-2">
                        <button
                          onClick={() => {
                            logout();
                            setShowProfileMenu(false);
                          }}
                          className="flex items-center justify-center space-x-2 w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-lg cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="font-medium">Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Login Button for non-authenticated users
                <Link
                  to="/login"
                  className="hidden sm:flex items-center space-x-1 sm:space-x-2 px-3 sm:px-5 py-1.5 sm:py-2 bg-gradient-to-r from-black to-gray-800 text-white rounded-lg hover:from-gray-800 hover:to-black transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                >
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="font-medium">Login</span>
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                ) : (
                  <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-50 md:hidden transition-transform duration-300 ${
        isMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Overlay */}
        <div 
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
            isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Menu Panel */}
        <div className="absolute right-0 top-0 h-full w-[85vw] sm:w-80 max-w-sm bg-white shadow-xl overflow-y-auto">
          {/* Menu Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              {currentUser && photoURL ? (
                <img
                  src={photoURL}
                  alt="profile"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
                />
              ) : currentUser ? (
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-black to-gray-700 text-white rounded-full flex items-center justify-center text-base sm:text-lg font-bold flex-shrink-0">
                  {getInitial()}
                </div>
              ) : null}
              <div className="min-w-0 flex-1">
                {currentUser ? (
                  <>
                    <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{getUserName()}</p>
                    <p className="text-xs sm:text-sm text-gray-500 capitalize">{role}</p>
                  </>
                ) : (
                  <p className="font-medium text-gray-900 text-sm sm:text-base">Welcome Guest</p>
                )}
              </div>
            </div>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 flex-shrink-0"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <div className="p-3 sm:p-4">
            {navLinks.map((link) => (
              <div key={link.path}>
                {link.protected && !currentUser ? (
                  <button
                    onClick={(e) => {
                      setIsMenuOpen(false);
                      handleProtectedRouteClick(e, link.path);
                    }}
                    className={`flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-3 sm:py-3.5 rounded-lg mb-1 transition-colors text-sm sm:text-base w-full text-left ${
                      location.pathname === link.path
                        ? 'bg-gray-100 text-gray-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className={`p-1.5 sm:p-2 rounded-lg ${
                      location.pathname === link.path 
                        ? 'bg-gray-200' 
                        : 'bg-gray-100'
                    }`}>
                      {link.icon}
                    </div>
                    <span className="font-medium">{link.label}</span>
                    <Lock className="w-3 h-3 ml-auto text-gray-400" />
                  </button>
                ) : (
                  <Link
                    to={link.path}
                    className={`flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-3 sm:py-3.5 rounded-lg mb-1 transition-colors text-sm sm:text-base ${
                      location.pathname === link.path
                        ? 'bg-black text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className={`p-1.5 sm:p-2 rounded-lg ${
                      location.pathname === link.path 
                        ? 'bg-white/20' 
                        : 'bg-gray-100'
                    }`}>
                      {link.icon}
                    </div>
                    <span className="font-medium">{link.label}</span>
                  </Link>
                )}
              </div>
            ))}
            
            {/* Mobile Wishlist Link */}
            {currentUser ? (
              <Link
                to="/wishlist"
                className={`flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-3 sm:py-3.5 rounded-lg mb-1 transition-colors text-sm sm:text-base ${
                  location.pathname === '/wishlist'
                    ? 'bg-red-50 text-red-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <div className={`p-1.5 sm:p-2 rounded-lg ${
                  location.pathname === '/wishlist'
                    ? 'bg-red-100'
                    : 'bg-gray-100'
                }`}>
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="font-medium">My Wishlist</span>
                {displayWishlistCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {displayWishlistCount > 9 ? '9+' : displayWishlistCount}
                  </span>
                )}
              </Link>
            ) : (
              <button
                onClick={(e) => {
                  setIsMenuOpen(false);
                  handleProtectedRouteClick(e, '/wishlist');
                }}
                className="flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-3 sm:py-3.5 rounded-lg mb-1 transition-colors text-sm sm:text-base w-full text-left text-gray-700 hover:bg-gray-100"
              >
                <div className="p-1.5 sm:p-2 rounded-lg bg-gray-100">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="font-medium">My Wishlist</span>
                <Lock className="w-3 h-3 ml-auto text-gray-400" />
              </button>
            )}
            
            {/* Mobile Cart Link */}
            <Link
              to="/checkout"
              className={`flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-3 sm:py-3.5 rounded-lg mb-1 transition-colors text-sm sm:text-base ${
                location.pathname === '/checkout'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <div className={`p-1.5 sm:p-2 rounded-lg ${
                location.pathname === '/checkout'
                  ? 'bg-blue-100'
                  : 'bg-gray-100'
              }`}>
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="font-medium">My Cart</span>
              {itemCount > 0 && (
                <span className="ml-auto bg-black text-white text-xs px-2 py-0.5 rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>

          </div>

          {/* Mobile Auth Section */}
          <div className="absolute bottom-0 left-0 right-0 border-t p-4 sm:p-6 bg-white">
            {currentUser ? (
              <div className="space-y-2 sm:space-y-3">
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center justify-center space-x-2 w-full px-4 py-2.5 sm:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
                >
                  <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center justify-center space-x-2 px-4 py-2.5 sm:py-3 bg-gradient-to-r from-black to-gray-800 text-white rounded-lg hover:from-gray-800 hover:to-black transition-all text-sm sm:text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Login / Register</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Login Required Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-fadeIn">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Login Required
              </h3>
              <p className="text-gray-600">
                Please login to access your orders and other personalized features
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-blue-800">
                      By logging in, you can:
                    </p>
                    <ul className="text-sm text-blue-700 mt-2 space-y-1">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        View your order history
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        Track your shipments
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        Save items to your wishlist
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        Get personalized recommendations
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={handleLoginAndRedirect}
                  className="flex-1 bg-gradient-to-r from-black to-gray-800 text-white py-3 rounded-lg font-semibold hover:from-gray-800 hover:to-black transition-all flex items-center justify-center gap-2"
                >
                  <User className="w-5 h-5" />
                  Login Now
                </button>
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                >
                  Continue Browsing
                </button>
              </div>

              <p className="text-center text-sm text-gray-500 pt-4">
                Don't have an account?{" "}
                <button
                  onClick={handleLoginAndRedirect}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Sign up for free
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Separate CartLink component to handle potential issues
const CartLink = ({ to, children, title, className }) => {
  return (
    <Link 
      to={to} 
      className={className}
      title={title}
    >
      {children}
    </Link>
  );
};

export default Navbar;