export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface SignUpPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SignInPayload {
  email: string;
  password: string;
}

/* ── Product ── */

export interface ProductImage {
  url: string;
  public_id: string;
  _id?: string;
}

export interface Review {
  _id: string;
  user: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  id?: string;
  user: { _id: string; name: string; email: string } | string;
  name: string;
  slug: string;
  images: ProductImage[];
  brand: string;
  category: string;
  description: string;
  reviews: Review[];
  rating: number;
  numReviews: number;
  price: number;
  countInStock: number;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  success: boolean;
  totalProducts: number;
  products: Product[];
}

export interface ProductResponse {
  success: boolean;
  product: Product;
}

export interface CategoriesResponse {
  success: boolean;
  categories: string[];
}

export interface ProductFilters {
  category?: string;
  name?: string;
  minPrice?: number;
  maxPrice?: number;
}

/* ── Cart ── */

export interface CartItem {
  product: Product;
  quantity: number;
  _id: string;
}

export interface Cart {
  _id: string;
  user: string;
  products: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CartResponse {
  success: boolean;
  cart: Cart;
}

export interface CartRemoveResponse {
  success: boolean;
  cart?: Cart;
  message?: string;
}

/* ── Banner ── */

export interface Banner {
  _id: string;
  name: string;
  image: { url: string; public_id: string };
  createdAt: string;
  updatedAt: string;
}

export interface BannersResponse {
  success: boolean;
  totalBanners: number;
  banners: Banner[];
}

/* ── Order ── */

export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export interface OrderItem {
  product: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  _id: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  _id: string;
  user: { _id: string; name: string; email: string } | string;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: "COD" | "Card" | "PayPal";
  itemsPrice: number;
  shippingPrice: number;
  totalPrice: number;
  status: OrderStatus;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderResponse {
  success: boolean;
  order: Order;
}

export interface OrdersResponse {
  success: boolean;
  orders: Order[];
}

export interface PlaceOrderPayload {
  shippingAddress: ShippingAddress;
  paymentMethod: "COD" | "Card";
  orderItems?: OrderItem[];
  itemsPrice?: number;
  shippingPrice?: number;
  totalPrice?: number;
}
