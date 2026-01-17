// src/pages/Checkout.jsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCart } from "../context/CartContext";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  Loader,
  ShoppingBag,
  CreditCard,
  Truck,
  MapPin,
  User,
  Mail,
  Phone,
  Minus,
  Plus,
  Trash2,
  ShieldCheck,
  Package,
  ChevronRight,
  Home,
  Building,
  Tag
} from "lucide-react";

// Validation schema
const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string()
    .matches(/^[+]?[0-9]{10,15}$/, "Please enter a valid phone number")
    .required("Phone number is required"),
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  postalCode: yup.string().required("Postal code is required"),
  payment: yup.string().oneOf(["COD"], "Only Cash on Delivery available").required("Payment method is required"),
  notes: yup.string().max(200, "Notes cannot exceed 200 characters"),
});

const Checkout = () => {
  const { items, clearCart, removeItem, updateQuantity, itemCount } = useCart();
  const { token, currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    { number: 1, label: "Contact", icon: <User className="w-4 h-4" /> },
    { number: 2, label: "Shipping", icon: <Truck className="w-4 h-4" /> },
    { number: 3, label: "Payment", icon: <CreditCard className="w-4 h-4" /> },
  ];

  const total = items.reduce((sum, i) => sum + i.qty * Number(i.price), 0);
  const shippingFee = total > 100 ? 0 : 15;
  const tax = total * 0.08; // 8% tax
  const grandTotal = total + shippingFee + tax;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: currentUser?.email || "",
      firstName: currentUser?.displayName?.split(' ')[0] || "",
      lastName: currentUser?.displayName?.split(' ')[1] || "",
      payment: "COD",
    }
  });

  const handleQuantityChange = (itemId, size, newQty) => {
    if (newQty < 1) {
      removeItem(itemId, size);
    } else {
      updateQuantity(itemId, size, newQty);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const loadingToast = toast.loading("Processing your order...");

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/orders`,
        {
          ...data,
          items,
          subtotal: total.toFixed(2),
          shipping: shippingFee.toFixed(2),
          tax: tax.toFixed(2),
          grandTotal: grandTotal.toFixed(2),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.dismiss(loadingToast);
      toast.success("🎉 Order placed successfully!");
      clearCart();
      setTimeout(() => navigate("/success"), 1500);
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.response?.data?.message || "Order failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0)
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center px-4">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12 text-gray-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Your cart is empty</h1>
        <p className="text-gray-600 mb-8 text-center max-w-md">
          Add some amazing products to your cart and come back here to complete your purchase.
        </p>
        <button
          onClick={() => navigate("/shop")}
          className="px-8 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-all flex items-center gap-2"
        >
          <ShoppingBag className="w-5 h-5" />
          Continue Shopping
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />

      <div className="lg:max-w-10/12 mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex flex-col items-center ${activeStep >= step.number ? 'text-black' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${activeStep >= step.number
                      ? 'bg-black text-white shadow-md'
                      : 'bg-gray-200 text-gray-400'
                    }`}>
                    {step.icon}
                  </div>
                  <span className="text-sm font-medium hidden sm:block">{step.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 sm:mx-8 ${activeStep > step.number ? 'bg-black' : 'bg-gray-300'
                    }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Contact Information */}
              <div className="bg-white rounded-2xl shadow-sm border p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Contact Information</h2>
                    <p className="text-gray-600 text-sm">We'll use this to send order updates</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </label>
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="you@example.com"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                    />
                    {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </label>
                    <input
                      {...register("phone")}
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                    />
                    {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone.message}</p>}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-2xl shadow-sm border p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Shipping Address</h2>
                    <p className="text-gray-600 text-sm">Where should we deliver your order?</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                      {...register("firstName")}
                      placeholder="John"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                    />
                    {errors.firstName && <p className="mt-2 text-sm text-red-600">{errors.firstName.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                      {...register("lastName")}
                      placeholder="Doe"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                    />
                    {errors.lastName && <p className="mt-2 text-sm text-red-600">{errors.lastName.message}</p>}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    Street Address
                  </label>
                  <input
                    {...register("address")}
                    placeholder="123 Main Street, Apt 4B"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                  />
                  {errors.address && <p className="mt-2 text-sm text-red-600">{errors.address.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      City
                    </label>
                    <input
                      {...register("city")}
                      placeholder="New York"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                    />
                    {errors.city && <p className="mt-2 text-sm text-red-600">{errors.city.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Postal Code
                    </label>
                    <input
                      {...register("postalCode")}
                      placeholder="10001"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                    />
                    {errors.postalCode && <p className="mt-2 text-sm text-red-600">{errors.postalCode.message}</p>}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Order Notes (Optional)</label>
                  <textarea
                    {...register("notes")}
                    placeholder="Special instructions for delivery..."
                    rows="3"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition resize-none"
                  />
                  {errors.notes && <p className="mt-2 text-sm text-red-600">{errors.notes.message}</p>}
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl shadow-sm border p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
                    <p className="text-gray-600 text-sm">Choose how you want to pay</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 border-2 border-black rounded-lg cursor-pointer hover:bg-gray-50 transition">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                        <Truck className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold">Cash on Delivery</div>
                        <p className="text-sm text-gray-600">Pay when you receive your order</p>
                      </div>
                    </div>
                    <input
                      {...register("payment")}
                      type="radio"
                      value="COD"
                      defaultChecked
                      className="w-5 h-5 text-black"
                    />
                  </label>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <ShieldCheck className="w-5 h-5 text-green-600" />
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Secure checkout:</span> Your payment information is encrypted and secure.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-black to-gray-800 text-white py-4 rounded-xl font-bold hover:from-gray-800 hover:to-black transition duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-3 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin" size={24} />
                    Processing Order...
                  </>
                ) : (
                  <>
                    <Package className="w-5 h-5" />
                    Place Order • ${grandTotal.toFixed(2)}
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-orange-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
              </div>

              {/* Items List */}
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={`${item._id}-${item.size}`} className="flex gap-4 items-center group py-4">
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-black text-white text-xs rounded-full flex items-center justify-center">
                        {item.qty}
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 line-clamp-1">{item.name}</h3>
                      <p className="text-sm text-gray-600">Size: {item.size}</p>
                      <p className="font-bold text-gray-900">${Number(item.price).toFixed(2)}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(item._id, item.size, item.qty - 1)}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => removeItem(item._id, item.size)}
                        className="w-8 h-8 flex items-center justify-center border border-red-200 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition opacity-0 group-hover:opacity-100"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleQuantityChange(item._id, item.size, item.qty + 1)}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t mt-6 pt-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shippingFee === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `$${shippingFee.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (8%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-3 text-lg font-bold">
                  <span>Total</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Promo Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code"
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                  />
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium">
                    Apply
                  </button>
                </div>
              </div>
            </div>

            {/* Security & Support Info */}
            <div className="bg-gradient-to-br from-gray-900 to-black text-white rounded-2xl p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5" />
                  <div>
                    <p className="font-semibold">Secure Checkout</p>
                    <p className="text-sm text-gray-300">Your payment is safe with us</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5" />
                  <div>
                    <p className="font-semibold">Free Shipping</p>
                    <p className="text-sm text-gray-300">On orders over $100</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5" />
                  <div>
                    <p className="font-semibold">Easy Returns</p>
                    <p className="text-sm text-gray-300">30-day return policy</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Continue Shopping */}
            <button
              onClick={() => navigate("/shop")}
              className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;