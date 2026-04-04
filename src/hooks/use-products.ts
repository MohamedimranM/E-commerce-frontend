"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getProductsService,
  getProductByIdService,
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

export const useGetProductById = (id: string) =>
  useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductByIdService(id),
    enabled: !!id,
  });
