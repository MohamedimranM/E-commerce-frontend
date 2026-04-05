"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Package, ArrowRight, Loader2 } from "lucide-react";
import { useGetOrderById } from "@/hooks/use-orders";
import { formatPrice } from "@/lib/format-price";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") ?? "";
  const { data, isLoading } = useGetOrderById(orderId);
  const order = data?.order;

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 size={40} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-16 text-center">
      {/* Success icon */}
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
        <CheckCircle2 size={40} className="text-green-500" />
      </div>

      <h1 className="mb-2 text-2xl font-bold text-dark">
        Order Placed Successfully!
      </h1>
      <p className="mb-1 text-gray-500">
        Thank you for your order. We&apos;ll send you a confirmation email
        shortly.
      </p>

      {order && (
        <p className="mb-6 text-sm text-gray-400">
          Order ID:{" "}
          <span className="font-mono font-semibold text-primary">
            #{order._id.slice(-8).toUpperCase()}
          </span>
        </p>
      )}

      {/* Order summary card */}
      {order && (
        <div className="mb-8 w-full rounded-xl border border-gray-100 bg-white p-5 text-left shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-dark">
            <Package size={16} className="text-primary" />
            Order Details
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Items</span>
              <span className="font-medium">{order.orderItems.length}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Payment</span>
              <span className="font-medium">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span
                className={`font-medium ${order.shippingPrice === 0 ? "text-green-600" : ""}`}
              >
                {order.shippingPrice === 0
                  ? "Free"
                  : formatPrice(order.shippingPrice)}
              </span>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-2">
              <span className="font-bold text-dark">Total</span>
              <span className="font-bold text-dark">
                {formatPrice(order.totalPrice)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row">
        {orderId && (
          <Link
            href={`/orders/${orderId}`}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-dark transition hover:bg-gray-50"
          >
            <Package size={16} />
            View Order
          </Link>
        )}
        <Link
          href="/products"
          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
        >
          Continue Shopping
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 size={40} className="animate-spin text-primary" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
