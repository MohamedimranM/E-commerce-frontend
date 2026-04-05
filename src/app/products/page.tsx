"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Star, SlidersHorizontal, X, Loader2, PackageOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetProducts, useGetCategories } from "@/hooks/use-products";
import type { Product, ProductFilters } from "@/types";

/* ── helpers ── */
const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-AE", { style: "currency", currency: "AED", maximumFractionDigits: 0 }).format(n);

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={i <= Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}
        />
      ))}
    </div>
  );
}

/* ── ProductCard ── */
function getDiscount(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return (Math.abs(hash) % 21) + 10; // 10-30%
}

function ProductCard({ product }: { product: Product }) {
  const discount = getDiscount(product._id);
  const originalPrice = Math.round(product.price / (1 - discount / 100));

  return (
    <Link href={`/products/${product.slug}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-50 p-4">
          {product.images?.[0]?.url ? (
            <Image
              src={product.images[0].url}
              alt={product.name}
              fill
              className="object-contain transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-300">
              <PackageOpen size={48} />
            </div>
          )}
          {product.isFeatured && (
            <span className="absolute left-2 top-2 rounded-md bg-accent px-2 py-0.5 text-[10px] font-bold uppercase text-white">
              Featured
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col gap-1.5 p-4 pt-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
            {product.brand}
          </p>
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-dark group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          <div className="mt-auto flex items-center gap-1.5 pt-2">
            <StarRating rating={product.rating} />
            <span className="text-xs text-gray-400">({product.numReviews})</span>
          </div>

          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-lg font-bold text-dark">
              {formatPrice(product.price)}
            </span>
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(originalPrice)}
            </span>
            <span className="text-xs font-semibold text-green-600">
              {discount}% off
            </span>
          </div>

          {product.countInStock === 0 && (
            <p className="mt-1 text-xs font-medium text-red-500">Out of Stock</p>
          )}
        </div>
      </motion.div>
    </Link>
  );
}

/* ── Sidebar filters ── */

const PRICE_RANGES = [
  { label: "Under AED 500", min: 0, max: 500 },
  { label: "AED 500 – AED 1,000", min: 500, max: 1000 },
  { label: "AED 1,000 – AED 5,000", min: 1000, max: 5000 },
  { label: "AED 5,000 – AED 20,000", min: 5000, max: 20000 },
  { label: "Over AED 20,000", min: 20000, max: undefined },
];

/* ── Main page ── */
function ProductsContent() {
  const searchParams = useSearchParams();
  const nameFromUrl = searchParams.get("name") || "";

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const filters = useMemo<ProductFilters>(() => {
    const f: ProductFilters = {};
    if (nameFromUrl) f.name = nameFromUrl;
    if (selectedCategory) f.category = selectedCategory;
    if (selectedPrice !== null) {
      const range = PRICE_RANGES[selectedPrice];
      if (range) {
        f.minPrice = range.min;
        f.maxPrice = range.max;
      }
    }
    return f;
  }, [nameFromUrl, selectedCategory, selectedPrice]);

  const { data, isLoading } = useGetProducts(filters);
  const { data: categoriesData } = useGetCategories();
  const products = data?.products ?? [];
  const categories = categoriesData?.categories ?? [];

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedPrice(null);
  };

  const hasFilters = !!selectedCategory || selectedPrice !== null;

  /* ── Filter sidebar content ── */
  const filterContent = (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">
          Category
        </h4>
        <div className="space-y-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() =>
                setSelectedCategory(selectedCategory === cat ? "" : cat)
              }
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                selectedCategory === cat
                  ? "bg-primary/10 font-semibold text-primary"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">
          Price
        </h4>
        <div className="space-y-1">
          {PRICE_RANGES.map((range, idx) => (
            <button
              key={range.label}
              onClick={() =>
                setSelectedPrice(selectedPrice === idx ? null : idx)
              }
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                selectedPrice === idx
                  ? "bg-primary/10 font-semibold text-primary"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="w-full rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-500 transition hover:bg-gray-50"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark">
            {nameFromUrl ? `Results for "${nameFromUrl}"` : "All Products"}
          </h1>
          {!isLoading && (
            <p className="mt-1 text-sm text-gray-500">
              {products.length} product{products.length !== 1 && "s"} found
            </p>
          )}
        </div>

        {/* Mobile filter toggle */}
        <button
          onClick={() => setFilterOpen(true)}
          className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium transition hover:bg-gray-50 lg:hidden"
        >
          <SlidersHorizontal size={16} />
          Filters
        </button>
      </div>

      <div className="flex gap-6">
        {/* Desktop sidebar */}
        <aside className="hidden w-60 shrink-0 lg:block">
          <div className="sticky top-20 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-bold text-dark">Filters</h3>
            {filterContent}
          </div>
        </aside>

        {/* Mobile slide-over */}
        <AnimatePresence>
          {filterOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black lg:hidden"
                onClick={() => setFilterOpen(false)}
              />
              <motion.aside
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: "spring", damping: 25, stiffness: 250 }}
                className="fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto bg-white p-5 shadow-2xl lg:hidden"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-dark">Filters</h3>
                  <button onClick={() => setFilterOpen(false)}>
                    <X size={20} className="text-gray-400" />
                  </button>
                </div>
                {filterContent}
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Product grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="flex h-80 items-center justify-center">
              <Loader2 size={36} className="animate-spin text-primary" />
            </div>
          ) : products.length === 0 ? (
            <div className="flex h-80 flex-col items-center justify-center text-center">
              <PackageOpen size={64} className="mb-4 text-gray-300" />
              <p className="text-lg font-semibold text-gray-500">
                No products found
              </p>
              <p className="mt-1 text-sm text-gray-400">
                Try adjusting your search or filters
              </p>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-4 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white transition hover:bg-primary-dark"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-80 items-center justify-center">
          <Loader2 size={36} className="animate-spin text-primary" />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
