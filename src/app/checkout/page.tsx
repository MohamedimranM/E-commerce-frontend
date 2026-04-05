"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  Loader2,
  ShoppingBag,
  PackageOpen,
  Truck,
  Shield,
} from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useGetCart } from "@/hooks/use-cart";
import { usePlaceOrder } from "@/hooks/use-orders";
import type { ShippingAddress } from "@/types";
import { formatPrice } from "@/lib/format-price";

const emptyAddress: ShippingAddress = {
  fullName: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  postalCode: "",
  country: "UAE",
};

export default function CheckoutPage() {
  const router = useRouter();
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  const { data: cartData, isLoading: cartLoading } = useGetCart();
  const placeOrder = usePlaceOrder();

  const [shipping, setShipping] = useState<ShippingAddress>(emptyAddress);
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingAddress, string>>>({});

  const cartItems = cartData?.cart?.products ?? [];
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shippingCost = subtotal > 500 ? 0 : 30;
  const total = subtotal + shippingCost;

  const handleChange = (field: keyof ShippingAddress, value: string) => {
    setShipping((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ShippingAddress, string>> = {};
    if (!shipping.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!shipping.phone.trim()) newErrors.phone = "Phone number is required";
    if (!shipping.address.trim()) newErrors.address = "Address is required";
    if (!shipping.city.trim()) newErrors.city = "City is required";
    if (!shipping.state.trim()) newErrors.state = "State is required";
    if (!shipping.postalCode.trim())
      newErrors.postalCode = "Postal code is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = () => {
    if (!validate()) return;
    placeOrder.mutate({
      shippingAddress: shipping,
      paymentMethod: "COD",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="mx-auto flex h-[60vh] max-w-7xl flex-col items-center justify-center px-4 text-center">
        <ShoppingBag size={64} className="mb-4 text-gray-300" />
        <p className="text-lg font-semibold text-gray-500">
          Please sign in to checkout
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

  if (cartLoading) {
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
      {/* Back */}
      <button
        onClick={() => router.push("/cart")}
        className="cursor-pointer mb-6 flex items-center gap-1 text-sm text-gray-400 transition hover:text-primary"
      >
        <ArrowLeft size={16} />
        Back to Cart
      </button>

      <h1 className="mb-6 text-2xl font-bold text-dark">Checkout</h1>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Left — Shipping Form */}
        <div className="flex-1 space-y-6">
          {/* Shipping Address */}
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <MapPin size={16} className="text-primary" />
              </div>
              <h2 className="text-base font-bold text-dark">
                Shipping Address
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-gray-500">
                  Full Name
                </label>
                <input
                  type="text"
                  value={shipping.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  placeholder="Enter full name"
                  className={`h-10 w-full rounded-lg border bg-gray-50 px-3 text-sm text-dark placeholder-gray-400 outline-none transition focus:bg-white focus:ring-2 focus:ring-primary/15 ${
                    errors.fullName
                      ? "border-red-300 focus:border-red-400"
                      : "border-gray-200 focus:border-primary/50"
                  }`}
                />
                {errors.fullName && (
                  <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={shipping.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="+971 XX XXX XXXX"
                  className={`h-10 w-full rounded-lg border bg-gray-50 px-3 text-sm text-dark placeholder-gray-400 outline-none transition focus:bg-white focus:ring-2 focus:ring-primary/15 ${
                    errors.phone
                      ? "border-red-300 focus:border-red-400"
                      : "border-gray-200 focus:border-primary/50"
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">
                  Country
                </label>
                <input
                  type="text"
                  value={shipping.country}
                  onChange={(e) => handleChange("country", e.target.value)}
                  placeholder="Country"
                  className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-dark placeholder-gray-400 outline-none transition focus:border-primary/50 focus:bg-white focus:ring-2 focus:ring-primary/15"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-gray-500">
                  Street Address
                </label>
                <input
                  type="text"
                  value={shipping.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  placeholder="Building, Street, Area"
                  className={`h-10 w-full rounded-lg border bg-gray-50 px-3 text-sm text-dark placeholder-gray-400 outline-none transition focus:bg-white focus:ring-2 focus:ring-primary/15 ${
                    errors.address
                      ? "border-red-300 focus:border-red-400"
                      : "border-gray-200 focus:border-primary/50"
                  }`}
                />
                {errors.address && (
                  <p className="mt-1 text-xs text-red-500">{errors.address}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">
                  City
                </label>
                <input
                  type="text"
                  value={shipping.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  placeholder="City"
                  className={`h-10 w-full rounded-lg border bg-gray-50 px-3 text-sm text-dark placeholder-gray-400 outline-none transition focus:bg-white focus:ring-2 focus:ring-primary/15 ${
                    errors.city
                      ? "border-red-300 focus:border-red-400"
                      : "border-gray-200 focus:border-primary/50"
                  }`}
                />
                {errors.city && (
                  <p className="mt-1 text-xs text-red-500">{errors.city}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">
                  State / Emirate
                </label>
                <input
                  type="text"
                  value={shipping.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                  placeholder="State / Emirate"
                  className={`h-10 w-full rounded-lg border bg-gray-50 px-3 text-sm text-dark placeholder-gray-400 outline-none transition focus:bg-white focus:ring-2 focus:ring-primary/15 ${
                    errors.state
                      ? "border-red-300 focus:border-red-400"
                      : "border-gray-200 focus:border-primary/50"
                  }`}
                />
                {errors.state && (
                  <p className="mt-1 text-xs text-red-500">{errors.state}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={shipping.postalCode}
                  onChange={(e) => handleChange("postalCode", e.target.value)}
                  placeholder="Postal Code"
                  className={`h-10 w-full rounded-lg border bg-gray-50 px-3 text-sm text-dark placeholder-gray-400 outline-none transition focus:bg-white focus:ring-2 focus:ring-primary/15 ${
                    errors.postalCode
                      ? "border-red-300 focus:border-red-400"
                      : "border-gray-200 focus:border-primary/50"
                  }`}
                />
                {errors.postalCode && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.postalCode}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                <CreditCard size={16} className="text-accent" />
              </div>
              <h2 className="text-base font-bold text-dark">Payment Method</h2>
            </div>

            <div className="flex items-center gap-3 rounded-lg border-2 border-primary bg-primary/5 p-4">
              <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary">
                <div className="h-2.5 w-2.5 rounded-full bg-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-dark">
                  Cash on Delivery (COD)
                </p>
                <p className="text-xs text-gray-500">
                  Pay when your order is delivered
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Order Summary */}
        <div className="lg:w-96">
          <div className="sticky top-20 space-y-4">
            {/* Items */}
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-gray-400">
                Order Summary ({cartItems.length} item
                {cartItems.length !== 1 ? "s" : ""})
              </h3>

              <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex gap-3">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-50">
                      {item.product.images?.[0]?.url ? (
                        <Image
                          src={item.product.images[0].url}
                          alt={item.product.name}
                          fill
                          className="object-contain p-1"
                          sizes="64px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-300">
                          <PackageOpen size={20} />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col">
                      <p className="text-sm font-medium text-dark line-clamp-1">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        Qty: {item.quantity}
                      </p>
                      <p className="mt-auto text-sm font-bold text-dark">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span
                    className={`font-medium ${shippingCost === 0 ? "text-green-600" : ""}`}
                  >
                    {shippingCost === 0 ? "Free" : formatPrice(shippingCost)}
                  </span>
                </div>
                {shippingCost > 0 && (
                  <p className="text-xs text-gray-400">
                    Free shipping on orders above {formatPrice(500)}
                  </p>
                )}
                <div className="flex justify-between border-t border-gray-100 pt-3">
                  <span className="text-base font-bold text-dark">Total</span>
                  <span className="text-base font-bold text-dark">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={placeOrder.isPending}
                className="cursor-pointer mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-dark hover:shadow-md disabled:opacity-60"
              >
                {placeOrder.isPending ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  "Place Order"
                )}
              </button>

              {/* Trust badges */}
              <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Shield size={12} />
                  Secure
                </span>
                <span className="flex items-center gap-1">
                  <Truck size={12} />
                  Fast Delivery
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
