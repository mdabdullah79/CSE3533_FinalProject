import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Login from "./pages/Login";
import Checkout from "./pages/Checkout";
import AdminDashboard from "./pages/AdminDashboard";
import Navbar from "./components/Navbar";
import { useAuth } from "./hooks/useAuth";
import { AuthProvider } from "./context/AuthProvider";
import ProductDetails from "./pages/ProductDetails";
import Wishlist from "./pages/Wishlist";
import Success from "./pages/Success";
import Footer from "./components/Footer";
import Orders from "./pages/Orders";
import Signup from "./pages/Signup";

// Admin Route Protection
const AdminRoute = ({ children }) => {
  const { role } = useAuth();
  return role === 'admin' ? children : <Navigate to="/" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/success" element={<Success />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}
export default App;