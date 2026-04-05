"use client";

import { use, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Loader2,
  Package,
  MapPin,
  CreditCard,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  PackageCheck,
  PackageOpen,
  AlertTriangle,
} from "lucide-react";
import { useGetOrderById, useCancelOrder } from "@/hooks/use-orders";
import { formatPrice } from "@/lib/format-price";
import type { OrderStatus } from "@/types";

const STATUS_STEPS: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Shipped",
  "Delivered",
];

const STATUS_ICON: Record<OrderStatus, React.ElementType> = {
  Pending: Clock,
  Confirmed: PackageCheck,
  Shipped: Truck,
  Delivered: CheckCircle2,
  Cancelled: XCircle,
};

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading } = useGetOrderById(id);
  const cancelOrder = useCancelOrder();
  const [showCancel, setShowCancel] = useState(false);
  const order = data?.order;

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 size={40} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto flex h-[60vh] max-w-7xl flex-col items-center justify-center px-4 text-center">
        <Package size={64} className="mb-4 text-gray-300" />
        <p className="text-lg font-semibold text-gray-500">Order not found</p>
        <Link
          href="/orders"
          className="mt-4 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition hover:bg-primary-dark"
        >
          View All Orders
        </Link>
      </div>
    );
  }

  const currentStep = STATUS_STEPS.indexOf(order.status);
  const isCancelled = order.status === "Cancelled";

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      {/* Back */}
      <Link
        href="/orders"
        className="mb-6 inline-flex items-center gap-1 text-sm text-gray-400 transition hover:text-primary"
      >
        <ArrowLeft size={16} />
        Back to Orders
      </Link>

      {/* Header */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark">
            Order{" "}
            <span className="font-mono text-primary">
              #{order._id.slice(-8).toUpperCase()}
            </span>
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-AE", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        {order.status === "Pending" && (
          <button
            onClick={() => setShowCancel(true)}
            className="cursor-pointer flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
          >
            <XCircle size={16} />
            Cancel Order
          </button>
        )}
      </div>

      {/* Cancel confirmation */}
      {showCancel && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <AlertTriangle size={20} className="mt-0.5 shrink-0 text-red-500" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-700">
              Cancel this order?
            </p>
            <p className="mt-1 text-xs text-red-600">
              This action cannot be undone. Stock will be restored.
            </p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => {
                  cancelOrder.mutate(order._id);
                  setShowCancel(false);
                }}
                disabled={cancelOrder.isPending}
                className="cursor-pointer rounded-lg bg-red-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {cancelOrder.isPending ? "Cancelling..." : "Yes, Cancel"}
              </button>
              <button
                onClick={() => setShowCancel(false)}
                className="cursor-pointer rounded-lg border border-gray-200 bg-white px-4 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
              >
                No, Keep It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Progress tracker */}
      {!isCancelled ? (
        <div className="mb-8 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            {STATUS_STEPS.map((step, i) => {
              const Icon = STATUS_ICON[step];
              const isActive = i <= currentStep;
              const isCurrent = i === currentStep;
              return (
                <div key={step} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full transition ${
                        isCurrent
                          ? "bg-primary text-white shadow-lg shadow-primary/30"
                          : isActive
                            ? "bg-primary/10 text-primary"
                            : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <Icon size={18} />
                    </div>
                    <span
                      className={`mt-2 text-xs font-medium ${
                        isCurrent
                          ? "text-primary"
                          : isActive
                            ? "text-gray-600"
                            : "text-gray-400"
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div
                      className={`mx-2 h-0.5 flex-1 rounded-full ${
                        i < currentStep ? "bg-primary" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mb-8 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <XCircle size={20} className="text-red-500" />
          <p className="text-sm font-semibold text-red-700">
            This order has been cancelled
          </p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left — Order items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-dark">
              <Package size={16} className="text-primary" />
              Items ({order.orderItems.length})
            </h3>

            <div className="space-y-3">
              {order.orderItems.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-4 rounded-lg border border-gray-50 p-3"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-50">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
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
                  <div className="flex flex-1 items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-dark">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatPrice(item.price)} × {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-dark">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Details sidebar */}
        <div className="space-y-4">
          {/* Totals */}
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-bold text-dark">Order Total</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(order.itemsPrice)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span
                  className={
                    order.shippingPrice === 0 ? "text-green-600 font-medium" : ""
                  }
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

          {/* Shipping */}
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-dark">
              <MapPin size={14} className="text-primary" />
              Shipping Address
            </h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p className="font-medium text-dark">
                {order.shippingAddress.fullName}
              </p>
              <p>{order.shippingAddress.phone}</p>
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>

          {/* Payment */}
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-dark">
              <CreditCard size={14} className="text-accent" />
              Payment
            </h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>{order.paymentMethod}</p>
              <p>
                {order.isPaid ? (
                  <span className="font-medium text-green-600">
                    Paid on{" "}
                    {order.paidAt
                      ? new Date(order.paidAt).toLocaleDateString("en-AE")
                      : "—"}
                  </span>
                ) : (
                  <span className="text-amber-600">Not Paid</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
