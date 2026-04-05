import Link from "next/link";
import Image from "next/image";
import { PackageOpen } from "lucide-react";
import { motion } from "framer-motion";
import StarRating from "@/components/ui/star-rating";
import { formatPrice } from "@/lib/format-price";
import type { Product } from "@/types";

function getDiscount(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++)
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return (Math.abs(hash) % 21) + 10; // 10-30%
}

export default function ProductCard({ product }: { product: Product }) {
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
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-dark transition-colors group-hover:text-primary">
            {product.name}
          </h3>

          <div className="mt-auto flex items-center gap-1.5 pt-2">
            <StarRating rating={product.rating} />
            <span className="text-xs text-gray-400">
              ({product.numReviews})
            </span>
          </div>

          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 pt-1">
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
            <p className="mt-1 text-xs font-medium text-red-500">
              Out of Stock
            </p>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
