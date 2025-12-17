"use client";

import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { FaTrashAlt } from "react-icons/fa"; // Trash icon for Remove Item
import Header from "@/components/Header";
import { useSession } from "next-auth/react";

interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
}

export default function CartPage() {
  
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const pathname = usePathname();
  // Calculate total price
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Cart item quantity handlers
  const decreaseQuantity = (id: string) => {
    setCartItems((prev) => {
      const updated = prev.map((item) =>
        item._id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  };

  const increaseQuantity = (id: string) => {
    setCartItems((prev) => {
      const updated = prev.map((item) =>
        item._id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => {
      const updated = prev.filter((item) => item._id !== id);
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.setItem("cart", JSON.stringify([]));
  };

  // Checkout handler
  const handleCheckout = () => {
    if (!session) {
      toast.info("Please login to proceed to checkout", { position: "top-center", autoClose: 2000 });
      setTimeout(() => {
        router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      }, 2000);
      return;
    }
    // Proceed to checkout page
    router.push("/checkout");
  };

  // Load cart items from localStorage
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem("cart");
        const parsedCart = savedCart ? JSON.parse(savedCart) : [];
        setCartItems(parsedCart);
      } catch (error) {
        console.error("Error loading cart:", error);
        setCartItems([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadCart();
  }, []);

  // Main return block for the page
  if (showAuthPrompt) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4 text-primary-600">Please login to proceed to checkout</h2>
          <p className="mb-6 text-gray-700">If you don&apos;t have an account, please register below.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/login?redirect=cart" className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors">Login</Link>
            <Link href="/register" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors">Register</Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-xl">Loading your cart...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8 min-h-screen relative">
        {/* Background Image Container (only blurred image) */}
        <div
          className="absolute top-0 left-0 w-full h-full bg-cover bg-center blur-md"
          style={{
            backgroundImage: `url('/cart.jpg')`,
            backgroundPosition: "center",
            backgroundAttachment: "fixed"
          }}
        ></div>

        {/* Content Wrapper */}
        <div className="relative z-10">
          {/* "Your Cart" Heading with Orange Border and Light Blue Background */}
          <h1
            className="text-4xl font-extrabold mb-8 text-center text-black mt-[-30px] p-4"
            style={{
              backgroundColor: "#d8e7f5", // Light blue background inside
              border: "3px solid #e97f3e", // Orange border
              padding: "10px", // Padding for better spacing
              borderRadius: "12px", // Rounded corners
              display: "block", // Make the heading span the full width
              width: "100%", // Full width of the container
              maxWidth: "100%", // Full width of the container
            }}
          >
            Your Cart
          </h1>

          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-6xl mb-4">🛒</div>
              <p className="text-xl mb-8 text-white">Your cart is empty</p>
              <Link
                href="/all-items"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded"
              >
                Browse Menu
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-wrap md:flex-nowrap justify-between items-center bg-white shadow-lg rounded-lg p-4 w-full min-w-0"
                  >
                    <div className="flex items-center space-x-4 w-full min-w-0">
                      <div className="w-20 h-20 relative flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <div className="w-0 flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600 capitalize truncate">
                          {item.category}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 md:space-x-8 w-auto md:w-full justify-between mt-4 md:mt-0">
                      <div className="text-sm text-gray-900 min-w-[48px] text-center">
                        {Number(item.price).toFixed(2)}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => decreaseQuantity(item._id)}
                          className="bg-red-500 hover:bg-red-600 text-white rounded-full px-2 py-1 font-bold"
                        >
                          -
                        </button>
                        <span className="font-semibold text-lg mx-2">{item.quantity}</span>
                        <button
                          onClick={() => increaseQuantity(item._id)}
                          className="bg-green-500 hover:bg-green-600 text-white rounded-full px-2 py-1 font-bold"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 py-2 font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 mt-8 gap-8">
                {/* Order Summary Box */}
                <div className="bg-gray-50 p-6 rounded-lg border w-full md:w-96 mb-6 md:mb-0">
                  <h2 className="text-lg font-bold mb-4 text-black">Order Summary</h2>
                  {cartItems.map((item) => (
                    <div className="flex justify-between mb-2 text-black" key={item._id}>
                      <span>{item.name}</span>
                      <span>
                        {item.quantity} × {Number(item.price).toFixed(2)} = { (item.quantity * Number(item.price)).toFixed(2) }
                      </span>
                    </div>
                  ))}
                  <hr className="my-2 border-gray-300" />
                  <div className="flex justify-between font-bold text-black text-lg mt-2">
                    <span>Total</span>
                    <span>৳{totalPrice.toFixed(2)}</span>
                  </div>
                </div>
                {/* Cart Actions */}
                <div className="flex flex-col gap-4 items-start w-full md:w-auto">
                  <button
                    onClick={clearCart}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded"
                  >
                    Clear Cart
                  </button>
                  <button
                    onClick={handleCheckout}
                    className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-6 rounded"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
