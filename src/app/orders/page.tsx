"use client";

import Link from "next/link";
import {
  ShoppingBag,
  Loader2,
  Package,
  ChevronRight,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  PackageCheck,
} from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useGetMyOrders } from "@/hooks/use-orders";
import { formatPrice } from "@/lib/format-price";
import type { OrderStatus } from "@/types";

const STATUS_CONFIG: Record<
  OrderStatus,
  { color: string; bg: string; icon: React.ElementType }
> = {
  Pending: { color: "text-amber-700", bg: "bg-amber-100", icon: Clock },
  Confirmed: {
    color: "text-blue-700",
    bg: "bg-blue-100",
    icon: PackageCheck,
  },
  Shipped: { color: "text-purple-700", bg: "bg-purple-100", icon: Truck },
  Delivered: {
    color: "text-green-700",
    bg: "bg-green-100",
    icon: CheckCircle2,
  },
  Cancelled: { color: "text-red-700", bg: "bg-red-100", icon: XCircle },
};

export default function MyOrdersPage() {
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  const { data, isLoading } = useGetMyOrders();
  const orders = data?.orders ?? [];

  if (!isAuthenticated) {
    return (
      <div className="mx-auto flex h-[60vh] max-w-7xl flex-col items-center justify-center px-4 text-center">
        <ShoppingBag size={64} className="mb-4 text-gray-300" />
        <p className="text-lg font-semibold text-gray-500">
          Please sign in to view your orders
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

  if (orders.length === 0) {
    return (
      <div className="mx-auto flex h-[60vh] max-w-7xl flex-col items-center justify-center px-4 text-center">
        <Package size={64} className="mb-4 text-gray-300" />
        <p className="text-lg font-semibold text-gray-500">
          No orders yet
        </p>
        <p className="mt-1 text-sm text-gray-400">
          Start shopping to see your orders here
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
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold text-dark">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => {
          const cfg = STATUS_CONFIG[order.status];
          const StatusIcon = cfg.icon;
          const itemCount = order.orderItems.reduce(
            (s, i) => s + i.quantity,
            0
          );

          return (
            <Link
              key={order._id}
              href={`/orders/${order._id}`}
              className="group flex flex-col rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition hover:border-primary/20 hover:shadow-md sm:flex-row sm:items-center sm:gap-5"
            >
              {/* Left — Order info */}
              <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
                {/* Order ID + date */}
                <div className="min-w-0">
                  <p className="text-sm font-bold text-dark">
                    Order{" "}
                    <span className="font-mono text-primary">
                      #{order._id.slice(-8).toUpperCase()}
                    </span>
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString("en-AE", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>

                {/* Items count */}
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <Package size={14} className="text-gray-400" />
                  {itemCount} item{itemCount !== 1 ? "s" : ""}
                </div>

                {/* Total */}
                <p className="text-sm font-bold text-dark">
                  {formatPrice(order.totalPrice)}
                </p>
              </div>

              {/* Right — Status + Arrow */}
              <div className="mt-3 flex items-center gap-3 sm:mt-0">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${cfg.bg} ${cfg.color}`}
                >
                  <StatusIcon size={12} />
                  {order.status}
                </span>
                <ChevronRight
                  size={18}
                  className="text-gray-300 transition group-hover:text-primary"
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
