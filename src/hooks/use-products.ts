"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getProductsService,
  getProductBySlugService,
  getCategoriesService,
} from "@/services/product.service";
import type { ProductFilters } from "@/types";

export const useGetCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: getCategoriesService,
  });

export const useGetProducts = (filters?: ProductFilters) =>
  useQuery({
    queryKey: ["products", filters],
    queryFn: () => getProductsService(filters),
  });

export const useGetProductBySlug = (slug: string) =>
  useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProductBySlugService(slug),
    enabled: !!slug,
  });
