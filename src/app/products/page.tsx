"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, Loader2, PackageOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetProducts, useGetCategories } from "@/hooks/use-products";
import BannerCarousel from "@/components/ui/banner-carousel";
import ProductCard from "@/components/ui/product-card";
import ProductFilters, { PRICE_RANGES } from "@/components/ui/product-filters";
import type { ProductFilters as ProductFiltersType } from "@/types";

/* ── Main page ── */
function ProductsContent() {
  const searchParams = useSearchParams();
  const nameFromUrl = searchParams.get("name") || "";

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const filters = useMemo<ProductFiltersType>(() => {
    const f: ProductFiltersType = {};
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Banner carousel */}
      <BannerCarousel />

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
          className="cursor-pointer flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium transition hover:bg-gray-50 lg:hidden"
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
            <ProductFilters
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedPrice={selectedPrice}
              onPriceChange={setSelectedPrice}
              onClear={clearFilters}
              hasFilters={hasFilters}
            />
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
                  <button className="cursor-pointer" onClick={() => setFilterOpen(false)}>
                    <X size={20} className="text-gray-400" />
                  </button>
                </div>
                <ProductFilters
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  selectedPrice={selectedPrice}
                  onPriceChange={setSelectedPrice}
                  onClear={clearFilters}
                  hasFilters={hasFilters}
                />
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
                  className="cursor-pointer mt-4 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white transition hover:bg-primary-dark"
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
