"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Star,
  ShoppingCart,
  Heart,
  ChevronLeft,
  Truck,
  Shield,
  RotateCcw,
  Loader2,
  PackageOpen,
  Minus,
  Plus,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetProductBySlug } from "@/hooks/use-products";
import { useAddToCart } from "@/hooks/use-cart";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import type { Review } from "@/types";

/* ── helpers ── */
const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 0,
  }).format(n);

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={
            i <= Math.round(rating)
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200"
          }
        />
      ))}
    </div>
  );
}

/* ── Review card ── */
function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary uppercase">
            {review.name?.[0] || "U"}
          </div>
          <div>
            <p className="text-sm font-semibold text-dark">{review.name}</p>
            <p className="text-[11px] text-gray-400">
              {new Date(review.createdAt).toLocaleDateString("en-AE", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 rounded-md bg-green-600 px-2 py-0.5 text-xs font-bold text-white">
          {review.rating}
          <Star size={10} className="fill-white" />
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-gray-600">
        {review.comment}
      </p>
    </div>
  );
}

/* ── Main ── */
export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { data, isLoading } = useGetProductBySlug(slug);
  const addToCart = useAddToCart();
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  const product = data?.product;

  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 size={40} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-center">
        <PackageOpen size={64} className="mb-4 text-gray-300" />
        <p className="text-lg font-semibold text-gray-500">Product not found</p>
        <button
          onClick={() => router.push("/products")}
          className="mt-4 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary-dark"
        >
          Browse Products
        </button>
      </div>
    );
  }

  const discount = (() => {
    let hash = 0;
    for (let i = 0; i < product._id.length; i++) hash = (hash * 31 + product._id.charCodeAt(i)) | 0;
    return (Math.abs(hash) % 21) + 10;
  })();
  const originalPrice = Math.round(product.price / (1 - discount / 100));
  const inStock = product.countInStock > 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Breadcrumb */}
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-1 text-sm text-gray-400 transition hover:text-primary"
      >
        <ChevronLeft size={16} />
        Back to products
      </button>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* ── Left: Images ── */}
        <div className="flex flex-col-reverse gap-4 sm:flex-row">
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2 sm:flex-col">
              {product.images.map((img, idx) => (
                <button
                  key={img.public_id}
                  onClick={() => setSelectedImage(idx)}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                    selectedImage === idx
                      ? "border-primary shadow-md"
                      : "border-gray-100 hover:border-gray-300"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    width={64}
                    height={64}
                    className="h-full w-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Main image */}
          <div className="relative flex-1 overflow-hidden rounded-2xl border border-gray-100 bg-white">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative aspect-square"
              >
                {product.images?.[selectedImage]?.url ? (
                  <Image
                    src={product.images[selectedImage].url}
                    alt={product.name}
                    fill
                    className="object-contain p-6"
                    priority
                    sizes="(max-width:1024px) 100vw, 50vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-300">
                    <PackageOpen size={80} />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {product.isFeatured && (
              <span className="absolute left-4 top-4 rounded-lg bg-accent px-3 py-1 text-xs font-bold uppercase text-white">
                Featured
              </span>
            )}
          </div>
        </div>

        {/* ── Right: Details ── */}
        <div className="flex flex-col gap-5">
          {/* Brand + name */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              {product.brand}
            </p>
            <h1 className="mt-1 text-2xl font-bold leading-tight text-dark sm:text-3xl">
              {product.name}
            </h1>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-lg bg-green-600 px-2.5 py-1 text-sm font-bold text-white">
              {product.rating.toFixed(1)}
              <Star size={12} className="fill-white" />
            </div>
            <span className="text-sm text-gray-500">
              {product.numReviews} Rating{product.numReviews !== 1 && "s"} &
              Review{product.numReviews !== 1 && "s"}
            </span>
          </div>

          {/* Price */}
          <div className="rounded-xl border border-gray-100 bg-surface p-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-dark">
                {formatPrice(product.price)}
              </span>
              <span className="text-base text-gray-400 line-through">
                {formatPrice(originalPrice)}
              </span>
              <span className="rounded-md bg-green-100 px-2 py-0.5 text-sm font-bold text-green-700">
                {discount}% off
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-400">Inclusive of all taxes</p>
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center gap-1 rounded-xl border border-gray-100 bg-white p-3 text-center">
              <Truck size={20} className="text-primary" />
              <span className="text-[11px] font-medium text-gray-500">
                Free Delivery
              </span>
            </div>
            <div className="flex flex-col items-center gap-1 rounded-xl border border-gray-100 bg-white p-3 text-center">
              <RotateCcw size={20} className="text-primary" />
              <span className="text-[11px] font-medium text-gray-500">
                7 Day Return
              </span>
            </div>
            <div className="flex flex-col items-center gap-1 rounded-xl border border-gray-100 bg-white p-3 text-center">
              <Shield size={20} className="text-primary" />
              <span className="text-[11px] font-medium text-gray-500">
                Warranty
              </span>
            </div>
          </div>

          {/* Category */}
          <div className="text-sm text-gray-500">
            Category:{" "}
            <span className="font-medium text-dark">{product.category}</span>
          </div>

          {/* Stock + Qty */}
          <div className="flex items-center gap-4">
            <span
              className={`flex items-center gap-1 text-sm font-semibold ${
                inStock ? "text-green-600" : "text-red-500"
              }`}
            >
              {inStock ? (
                <>
                  <Check size={14} /> In Stock
                </>
              ) : (
                "Out of Stock"
              )}
            </span>

            {inStock && (
              <div className="flex items-center gap-1 rounded-lg border border-gray-200">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="flex h-9 w-9 items-center justify-center text-gray-500 transition hover:text-dark"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center text-sm font-semibold">
                  {qty}
                </span>
                <button
                  onClick={() =>
                    setQty(Math.min(product.countInStock, qty + 1))
                  }
                  className="flex h-9 w-9 items-center justify-center text-gray-500 transition hover:text-dark"
                >
                  <Plus size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              disabled={!inStock || addToCart.isPending}
              onClick={() => {
                if (!isAuthenticated) {
                  router.push("/signin");
                  return;
                }
                addToCart.mutate({ productId: product._id, quantity: qty });
              }}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-dark hover:shadow-md disabled:opacity-50"
            >
              <ShoppingCart size={18} />
              {addToCart.isPending ? "Adding..." : "Add to Cart"}
            </button>
            <button className="flex h-12.5 w-12.5 items-center justify-center rounded-xl border border-gray-200 text-gray-400 transition hover:border-red-200 hover:text-red-500">
              <Heart size={20} />
            </button>
          </div>

          {/* Description */}
          <div className="rounded-xl border border-gray-100 bg-white p-5">
            <h3 className="mb-2 text-sm font-bold text-dark">Description</h3>
            <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-line">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      {/* ── Reviews ── */}
      {product.reviews.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-6 text-xl font-bold text-dark">
            Ratings & Reviews
            <span className="ml-2 text-base font-normal text-gray-400">
              ({product.reviews.length})
            </span>
          </h2>

          {/* Rating summary */}
          <div className="mb-6 flex items-center gap-6 rounded-xl border border-gray-100 bg-white p-5">
            <div className="text-center">
              <p className="text-4xl font-extrabold text-dark">
                {product.rating.toFixed(1)}
              </p>
              <StarRating rating={product.rating} size={16} />
              <p className="mt-1 text-xs text-gray-400">
                {product.numReviews} review{product.numReviews !== 1 && "s"}
              </p>
            </div>

            {/* Rating bars */}
            <div className="flex-1 space-y-1.5">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = product.reviews.filter(
                  (r) => Math.round(r.rating) === star
                ).length;
                const percent =
                  product.reviews.length > 0
                    ? (count / product.reviews.length) * 100
                    : 0;
                return (
                  <div key={star} className="flex items-center gap-2 text-xs">
                    <span className="w-3 text-right font-medium text-gray-500">
                      {star}
                    </span>
                    <Star size={10} className="fill-yellow-400 text-yellow-400" />
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-green-500 transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="w-6 text-gray-400">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Review cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            {product.reviews.map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
