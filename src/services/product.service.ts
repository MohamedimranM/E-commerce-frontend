import _axios from "@/lib/axios";
import type {
  ProductsResponse,
  ProductResponse,
  ProductFilters,
  CategoriesResponse,
} from "@/types";

export const getCategoriesService = () =>
  _axios<CategoriesResponse>("GET", "/products/categories");

export const getProductsService = (filters?: ProductFilters) => {
  const params = new URLSearchParams();
  if (filters?.category) params.append("category", filters.category);
  if (filters?.name) params.append("name", filters.name);
  if (filters?.minPrice) params.append("minPrice", String(filters.minPrice));
  if (filters?.maxPrice) params.append("maxPrice", String(filters.maxPrice));

  const query = params.toString();
  return _axios<ProductsResponse>("GET", `/products${query ? `?${query}` : ""}`);
};

export const getProductByIdService = (id: string) =>
  _axios<ProductResponse>("GET", `/products/${id}`);
