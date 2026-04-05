const PRICE_RANGES = [
  { label: "Under AED 500", min: 0, max: 500 },
  { label: "AED 500 – AED 1,000", min: 500, max: 1000 },
  { label: "AED 1,000 – AED 5,000", min: 1000, max: 5000 },
  { label: "AED 5,000 – AED 20,000", min: 5000, max: 20000 },
  { label: "Over AED 20,000", min: 20000, max: undefined },
];

export { PRICE_RANGES };

interface ProductFiltersProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  selectedPrice: number | null;
  onPriceChange: (idx: number | null) => void;
  onClear: () => void;
  hasFilters: boolean;
}

export default function ProductFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  selectedPrice,
  onPriceChange,
  onClear,
  hasFilters,
}: ProductFiltersProps) {
  return (
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
                onCategoryChange(selectedCategory === cat ? "" : cat)
              }
              className={`cursor-pointer block w-full rounded-lg px-3 py-2 text-left text-sm transition ${
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
                onPriceChange(selectedPrice === idx ? null : idx)
              }
              className={`cursor-pointer block w-full rounded-lg px-3 py-2 text-left text-sm transition ${
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
          onClick={onClear}
          className="cursor-pointer w-full rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-500 transition hover:bg-gray-50"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
