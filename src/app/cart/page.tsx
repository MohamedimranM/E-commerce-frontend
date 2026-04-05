"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  ArrowLeft,
  Loader2,
  PackageOpen,
} from "lucide-react";
import { useGetCart, useAddToCart, useRemoveFromCart } from "@/hooks/use-cart";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import type { CartItem } from "@/types";

const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 0,
  }).format(n);

function CartItemRow({ item }: { item: CartItem }) {
  const addToCart = useAddToCart();
  const removeFromCart = useRemoveFromCart();
  const product = item.product;

  return (
    <div className="flex gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="shrink-0">
        <div className="relative h-24 w-24 overflow-hidden rounded-lg bg-gray-50">
          {product.images?.[0]?.url ? (
            <Image
              src={product.images[0].url}
              alt={product.name}
              fill
              className="object-contain p-2"
              sizes="96px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-300">
              <PackageOpen size={32} />
            </div>
          )}
        </div>
      </Link>

      {/* Details */}
      <div className="flex flex-1 flex-col gap-1">
        <Link
          href={`/products/${product.slug}`}
          className="text-sm font-semibold text-dark hover:text-primary transition-colors line-clamp-2"
        >
          {product.name}
        </Link>
        <p className="text-xs text-gray-400">{product.brand}</p>
        <p className="mt-auto text-lg font-bold text-dark">
          {formatPrice(product.price)}
        </p>
      </div>

      {/* Quantity + Remove */}
      <div className="flex flex-col items-end justify-between">
        <button
          onClick={() => removeFromCart.mutate(product._id)}
          disabled={removeFromCart.isPending}
          className="cursor-pointer rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
        >
          <Trash2 size={16} />
        </button>

        <div className="flex items-center gap-1 rounded-lg border border-gray-200">
          <button
            onClick={() => {
              if (item.quantity <= 1) {
                removeFromCart.mutate(product._id);
              } else {
                addToCart.mutate({ productId: product._id, quantity: -1 });
              }
            }}
            disabled={addToCart.isPending}
            className="cursor-pointer flex h-8 w-8 items-center justify-center text-gray-500 transition hover:text-dark"
          >
            <Minus size={14} />
          </button>
          <span className="w-6 text-center text-sm font-semibold">
            {item.quantity}
          </span>
          <button
            onClick={() =>
              addToCart.mutate({ productId: product._id, quantity: 1 })
            }
            disabled={addToCart.isPending || item.quantity >= product.countInStock}
            className="cursor-pointer flex h-8 w-8 items-center justify-center text-gray-500 transition hover:text-dark disabled:opacity-40"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  const router = useRouter();
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  const { data, isLoading } = useGetCart();
  const cartItems = data?.cart?.products ?? [];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (!isAuthenticated) {
    return (
      <div className="mx-auto flex h-[60vh] max-w-7xl flex-col items-center justify-center px-4 text-center">
        <ShoppingBag size={64} className="mb-4 text-gray-300" />
        <p className="text-lg font-semibold text-gray-500">
          Please sign in to view your cart
        </p>
        <Link
          href="/signin"
          className="mt-4 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition hover:bg-primary-dark"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 size={40} className="animate-spin text-primary" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto flex h-[60vh] max-w-7xl flex-col items-center justify-center px-4 text-center">
        <ShoppingBag size={64} className="mb-4 text-gray-300" />
        <p className="text-lg font-semibold text-gray-500">
          Your cart is empty
        </p>
        <p className="mt-1 text-sm text-gray-400">
          Add some products to get started
        </p>
        <Link
          href="/products"
          className="mt-4 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition hover:bg-primary-dark"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Header */}
      <button
        onClick={() => router.back()}
        className="cursor-pointer mb-6 flex items-center gap-1 text-sm text-gray-400 transition hover:text-primary"
      >
        <ArrowLeft size={16} />
        Continue Shopping
      </button>

      <h1 className="mb-6 text-2xl font-bold text-dark">
        Shopping Cart{" "}
        <span className="text-base font-normal text-gray-400">
          ({totalItems} item{totalItems !== 1 && "s"})
        </span>
      </h1>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Cart items */}
        <div className="flex flex-1 flex-col gap-3">
          {cartItems.map((item) => (
            <CartItemRow key={item._id} item={item} />
          ))}
        </div>

        {/* Order summary */}
        <div className="lg:w-80">
          <div className="sticky top-20 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-gray-400">
              Order Summary
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({totalItems} items)</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="border-t border-gray-100 pt-3">
                <div className="flex justify-between">
                  <span className="text-base font-bold text-dark">Total</span>
                  <span className="text-base font-bold text-dark">
                    {formatPrice(subtotal)}
                  </span>
                </div>
              </div>
            </div>

            <button className="cursor-pointer mt-5 w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-dark hover:shadow-md">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
