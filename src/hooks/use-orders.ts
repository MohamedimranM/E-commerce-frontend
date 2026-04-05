"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import type { RootState } from "@/store";
import type { PlaceOrderPayload } from "@/types";
import {
  placeOrderService,
  getMyOrdersService,
  getOrderByIdService,
  cancelOrderService,
} from "@/services/order.service";

export const usePlaceOrder = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: PlaceOrderPayload) => placeOrderService(data),
    onSuccess: (data) => {
      toast.success("Order placed successfully!");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      router.push(`/checkout/success?orderId=${data.order._id}`);
    },
    onError: (error: unknown) => {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      toast.error(
        err?.response?.data?.message || err?.message || "Failed to place order"
      );
    },
  });
};

export const useGetMyOrders = () => {
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  return useQuery({
    queryKey: ["my-orders"],
    queryFn: getMyOrdersService,
    enabled: isAuthenticated,
  });
};

export const useGetOrderById = (id: string) =>
  useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrderByIdService(id),
    enabled: !!id,
  });

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cancelOrderService(id),
    onSuccess: () => {
      toast.success("Order cancelled");
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
    },
    onError: (error: unknown) => {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to cancel order"
      );
    },
  });
};
