"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  ShoppingCart,
  Search,
  User,
  LogOut,
  Menu,
  X,
  Heart,
  Package,
  ClipboardList,
  ChevronDown,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { store } from "@/store";
import { logout } from "@/store/features/auth-slice";
import { useGetCart } from "@/hooks/use-cart";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const user = useSelector((s: RootState) => s.auth.user);
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const { data: cartData } = useGetCart();
  const cartCount =
    cartData?.cart?.products?.reduce(
      (sum, item) => sum + item.quantity,
      0
    ) ?? 0;

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Add shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 2);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/products?name=${encodeURIComponent(search.trim())}`);
      setSearch("");
      setMobileOpen(false);
    }
  };

  const handleLogout = () => {
    setProfileOpen(false);
    store.dispatch(logout());
    router.push("/signin");
  };

  const navLinks = [
    { href: "/products", label: "Products", icon: Package },
    { href: "/orders", label: "My Orders", icon: ClipboardList },
  ];

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "bg-white/95 border-gray-200 shadow-lg backdrop-blur-md"
          : "bg-white border-gray-100 shadow-sm"
      }`}
    >
      {/* Accent top stripe */}
      <div className="h-0.75 bg-linear-to-r from-primary via-accent to-primary" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center gap-6">
          {/* Logo */}
          <Link
            href="/products"
            className="group flex shrink-0 items-center gap-2 text-xl font-extrabold tracking-tight"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-primary to-accent text-sm font-black text-white shadow-lg shadow-primary/25 transition-transform group-hover:scale-110">
              S
            </span>
            <span>
              <span className="text-dark">Shop</span>
              <span className="text-primary">Hub</span>
            </span>
          </Link>

          {/* Search – desktop */}
          <form
            onSubmit={handleSearch}
            className="mx-4 hidden flex-1 lg:flex"
          >
            <div className="group relative w-full max-w-lg">
              <Search
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-primary"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products, brands and more..."
                className="h-10 w-full rounded-full border border-gray-200 bg-gray-50 pl-10 pr-20 text-sm text-dark placeholder-gray-400 outline-none transition-all focus:border-primary/50 focus:bg-white focus:ring-2 focus:ring-primary/15"
              />
              <button
                type="submit"
                className="cursor-pointer absolute right-1 top-1 flex h-8 items-center gap-1.5 rounded-full bg-linear-to-r from-primary to-primary-dark px-4 text-xs font-semibold text-white shadow-md transition-all hover:shadow-lg hover:brightness-110 active:scale-95"
              >
                Search
              </button>
            </div>
          </form>

          {/* Nav links – desktop */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-gray-600 hover:bg-gray-100 hover:text-dark"
                  }`}
                >
                  <link.icon size={16} />
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-3.25 left-1/2 h-0.75 w-6 -translate-x-1/2 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
            {user ? (
              <>
                {/* Wishlist */}
                <button
                  className="cursor-pointer relative rounded-full p-2.5 text-gray-500 transition-all hover:bg-gray-100 hover:text-dark"
                  title="Wishlist"
                >
                  <Heart size={20} />
                </button>

                {/* Cart */}
                <Link
                  href="/cart"
                  className="relative rounded-full p-2.5 text-gray-500 transition-all hover:bg-gray-100 hover:text-dark"
                  title="Cart"
                >
                  <ShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-linear-to-r from-accent to-emerald-400 px-1 text-[10px] font-bold text-white shadow-lg shadow-accent/30 animate-[scale-in_0.2s_ease]">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </Link>

                {/* Divider */}
                <div className="mx-1 hidden h-6 w-px bg-gray-200 sm:block" />

                {/* Profile dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className={`cursor-pointer flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-2 text-sm font-medium transition-all sm:pr-3 ${
                      profileOpen
                        ? "bg-gray-100 text-dark"
                        : "text-gray-600 hover:bg-gray-100 hover:text-dark"
                    }`}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-primary to-accent text-xs font-bold uppercase text-white shadow-inner">
                      {user.name?.[0] || "U"}
                    </div>
                    <span className="hidden max-w-25 truncate sm:inline text-dark">
                      {user.name?.split(" ")[0]}
                    </span>
                    <ChevronDown
                      size={14}
                      className={`hidden transition-transform sm:block ${
                        profileOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-3 w-64 origin-top-right animate-[dropdown_0.15s_ease] overflow-hidden rounded-2xl border border-gray-100 bg-white text-dark shadow-2xl">
                      {/* User info */}
                      <div className="bg-linear-to-r from-primary/5 to-accent/5 px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-primary to-accent text-sm font-bold uppercase text-white">
                            {user.name?.[0] || "U"}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-dark">
                              {user.name}
                            </p>
                            <p className="truncate text-xs text-gray-500">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Dropdown actions */}
                      <div className="p-1.5">
                        <button
                          onClick={handleLogout}
                          className="cursor-pointer flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
                        >
                          <LogOut size={16} />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                href="/signin"
                className="flex items-center gap-2 rounded-full bg-linear-to-r from-primary to-primary-dark px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:brightness-110 active:scale-95"
              >
                <User size={16} />
                Sign In
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="cursor-pointer rounded-full p-2 text-gray-500 transition-all hover:bg-gray-100 hover:text-dark md:hidden"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`overflow-hidden transition-all duration-300 md:hidden ${
          mobileOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-gray-100 px-4 pb-5 pt-4">
          {/* Mobile search */}
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-dark placeholder-gray-400 outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
              />
            </div>
          </form>

          {/* Mobile nav links */}
          <nav className="mt-3 flex flex-col gap-0.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-gray-600 hover:bg-gray-100 hover:text-dark"
                  }`}
                >
                  <link.icon size={18} />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
