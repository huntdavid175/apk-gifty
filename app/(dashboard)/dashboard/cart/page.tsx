"use client";

import React, { useEffect, useState } from "react";
import CartItem from "@/components/Cart/CartItem";
import { useAtom } from "jotai";
import { cartAtom, CartState } from "@/atoms/cartAtom";
import { removeCartItem, updateCart, checkoutCart } from "@/utils/cartHelpers";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import loadingAnimation from "@/components/Animations/Lottie/blueloading.json";

const CartPage = () => {
  const [cart, setCart] = useAtom(cartAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  // Set mounted state to handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  const updateCartHandler = async (
    productId: string,
    productQuantity: number,
    updateType: string
  ) => {
    if (updateType === "increment") {
      productQuantity++;
    } else if (updateType === "decrement") {
      productQuantity--;
    }

    try {
      const response = await updateCart(productId, productQuantity);

      if (response && response.data) {
        // Sort the cart items by creation date (newest first)
        const sortedResponse = [...response.data].sort((a, b) => {
          const dateA = new Date(a.created_at).getTime();
          const dateB = new Date(b.created_at).getTime();
          return dateB - dateA; // Descending order (newest first)
        });

        // Calculate the new total
        const newTotal = sortedResponse.reduce((sum, item) => {
          return (
            sum + Number(item.product.price) * Number(item.product_quantity)
          );
        }, 0);

        // Update the cart state with sorted items and new total
        setCart((prev: CartState) => {
          const newState = {
            ...prev,
            items: sortedResponse,
            total: newTotal,
          };
          return newState;
        });
      }
    } catch (error) {
      console.error("Error updating cart:", error);
      setError("Failed to update cart. Please try again.");
    }
  };

  const checkoutCartHandler = async () => {
    try {
      setIsLoading(true);
      const response = await checkoutCart();
      if (
        response &&
        typeof response === "object" &&
        "checkoutResponse" in response
      ) {
        const { checkoutResponse, getCartResponse } = response as {
          checkoutResponse: { data: { data: { id: string } } };
          getCartResponse: { data: { data: any[] } };
        };

        if (checkoutResponse?.data?.data?.id) {
          // Update cart state with new cart data
          console.log(getCartResponse.data.data);
          const newCart = getCartResponse.data.data;
          const total = newCart.reduce(
            (acc: number, item: any) =>
              acc + Number(item.product.price) * item.product_quantity,
            0
          );

          router.push(
            `transaction/order/buy?category=Card&pid=${checkoutResponse.data.data.id}`
          );
          setCart((prev: CartState) => {
            const newState = {
              ...prev,
              items: newCart,
              total: total,
            };
            return newState;
          });
        }
      }
    } catch (error) {
      console.error("Error checking out cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeCartItemHandler = async (productId: string) => {
    try {
      const response = await removeCartItem(productId);

      if (response && response.data) {
        // Sort the cart items by creation date (newest first)
        const sortedResponse = [...response.data].sort((a, b) => {
          const dateA = new Date(a.created_at).getTime();
          const dateB = new Date(b.created_at).getTime();
          return dateB - dateA; // Descending order (newest first)
        });

        // Calculate the new total
        const newTotal = sortedResponse.reduce((sum, item) => {
          return (
            sum + Number(item.product.price) * Number(item.product_quantity)
          );
        }, 0);

        // Update the cart state with sorted items and new total
        setCart((prev: CartState) => {
          const newState = {
            ...prev,
            items: sortedResponse,
            total: newTotal,
          };
          return newState;
        });
      }
    } catch (error) {
      console.error("Error removing cart item:", error);
      setError("Failed to remove cart item. Please try again.");
    }
  };

  // Don't render anything until after hydration
  if (!mounted) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-400">Loading...</div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="container w-full h-full mx-auto px-4 py-8">
        <div className="w-full flex justify-center items-center h-full">
          <div className="w-[100px] h-[100px] ">
            <Lottie animationData={loadingAnimation} />
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center text-red-400">
          {error}
          <button
            className="mt-2 text-blue-400 hover:underline block mx-auto"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  // Calculate savings
  const savings = cart.items.reduce((total, item) => {
    const originalPrice = parseFloat(
      item.product.original_price?.toString() || item.product.price.toString()
    );
    const currentPrice = parseFloat(item.product.price.toString());
    return (
      total + (originalPrice - currentPrice) * Number(item.product_quantity)
    );
  }, 0);

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Cart Title */}
      <h1 className="text-xl font-medium mb-8 text-white">
        Cart <span className="text-gray-400">({cart.items.length} items)</span>
      </h1>

      {cart.items.length === 0 ? (
        <div className="text-center text-gray-400 py-8">Your cart is empty</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item: any) => (
              <CartItem
                key={item.product.id}
                cartId={item.id}
                productId={item.product.id}
                image={item.product.image_url}
                title={item.product.name}
                price={item.product.price.toString()}
                originalPrice={item.product.original_price?.toString()}
                quantity={item.product_quantity}
                currency={item.product.currency}
                updateCartHandler={updateCartHandler}
                removeCartItemHandler={removeCartItemHandler}
              />
            ))}
          </div>

          {/* Checkout Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#1e2328] rounded-lg p-6 lg:sticky lg:top-8">
              <button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg mb-6"
                onClick={checkoutCartHandler}
              >
                Checkout
              </button>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-gray-400">
                    Subtotal{" "}
                    <span className="text-white">
                      ({cart.items.length} items)
                    </span>
                  </div>
                  <div className="text-base text-white">
                    {cart.items[0]?.product?.currency?.symbol}
                    {cart.total.toFixed(2)}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-gray-400">Savings</div>
                  <div className="text-green-500">
                    -{cart.items[0]?.product?.currency?.symbol}
                    {savings.toFixed(2)}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-700 flex justify-between items-center">
                  <div className="text-white">Estimated total</div>
                  <div className="text-green-500 text-lg">
                    <span className="text-white">
                      {cart.items[0]?.product?.currency?.symbol}
                    </span>{" "}
                    {(cart.total - savings).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default CartPage;
