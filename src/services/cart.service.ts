import _axios from "@/lib/axios";
import type { CartResponse, CartRemoveResponse } from "@/types";

export const getCartService = () =>
  _axios<CartResponse>("GET", "/cart/my");

export const addToCartService = (productId: string, quantity: number) =>
  _axios<CartResponse>("POST", "/cart/add", { productId, quantity });

export const removeFromCartService = (productId: string) =>
  _axios<CartRemoveResponse>("POST", "/cart/remove", { productId });
