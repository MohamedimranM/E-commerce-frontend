"use client";

import Link from "next/link";
import { XCircle, ArrowLeft } from "lucide-react";

export default function CheckoutCancelPage() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-16 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
        <XCircle size={40} className="text-red-500" />
      </div>
      <h1 className="mb-2 text-2xl font-bold text-dark">Payment Cancelled</h1>
      <p className="mb-4 text-gray-500">
        Your payment was cancelled or failed. You can try again or return to your cart.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/cart"
          className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-dark transition hover:bg-gray-50"
        >
          <ArrowLeft size={16} />
          Back to Cart
        </Link>
        <Link
          href="/checkout"
          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
        >
          Try Again
        </Link>
      </div>
    </div>
  );
}
