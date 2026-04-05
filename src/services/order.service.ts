import _axios from "@/lib/axios";
import type {
  OrderResponse,
  OrdersResponse,
  PlaceOrderPayload,
} from "@/types";

export const placeOrderService = (data: PlaceOrderPayload) =>
  _axios<OrderResponse>("POST", "/orders", data);

export const getMyOrdersService = () =>
  _axios<OrdersResponse>("GET", "/orders/my");

export const getOrderByIdService = (id: string) =>
  _axios<OrderResponse>("GET", `/orders/${id}`);

export const cancelOrderService = (id: string) =>
  _axios<OrderResponse>("PUT", `/orders/${id}/cancel`);
