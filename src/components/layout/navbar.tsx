"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Search,
  User,
  LogOut,
  Menu,
  X,
  Heart,
} from "lucide-react";
import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { store } from "@/store";
import { logout } from "@/store/features/auth-slice";

export default function Navbar() {
  const router = useRouter();
  const user = useSelector((s: RootState) => s.auth.user);
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/products?name=${encodeURIComponent(search.trim())}`);
      setSearch("");
      setMobileOpen(false);
    }
  };

  const handleLogout = () => {
    store.dispatch(logout());
    router.push("/signin");
  };

  return (
    <header className="sticky top-0 z-50 bg-dark text-white shadow-lg">
      {/* Top bar */}
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center gap-4">
          {/* Logo */}
          <Link
            href="/products"
            className="shrink-0 text-xl font-bold tracking-tight"
          >
            <span className="text-accent">Shop</span>Hub
          </Link>

          {/* Search – desktop */}
          <form
            onSubmit={handleSearch}
            className="mx-6 hidden flex-1 md:flex"
          >
            <div className="relative w-full max-w-xl">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for products, brands and more..."
                className="h-10 w-full rounded-lg bg-white pl-4 pr-12 text-sm text-dark placeholder-gray-400 outline-none focus:ring-2 focus:ring-accent"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 flex h-8 w-10 items-center justify-center rounded-md bg-primary text-white transition hover:bg-primary-dark"
              >
                <Search size={16} />
              </button>
            </div>
          </form>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-1 md:gap-2">
            {user ? (
              <>
                <Link
                  href="/products"
                  className="hidden rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-white/10 md:inline-flex"
                >
                  Products
                </Link>
                <button className="relative rounded-lg p-2 transition hover:bg-white/10">
                  <Heart size={20} />
                </button>
                <button className="relative rounded-lg p-2 transition hover:bg-white/10">
                  <ShoppingCart size={20} />
                </button>

                {/* Profile dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-white/10"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold uppercase">
                      {user.name?.[0] || "U"}
                    </div>
                    <span className="hidden md:inline">
                      {user.name?.split(" ")[0]}
                    </span>
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl bg-white text-dark shadow-2xl ring-1 ring-gray-100">
                      <div className="border-b px-4 py-3">
                        <p className="text-sm font-semibold">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 transition hover:bg-red-50"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                href="/signin"
                className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-primary transition hover:bg-gray-100"
              >
                <User size={16} />
                Login
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-lg p-2 transition hover:bg-white/10 md:hidden"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile search + nav */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-dark px-4 pb-4 md:hidden">
          <form onSubmit={handleSearch} className="mt-3">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="h-10 w-full rounded-lg bg-white pl-4 pr-12 text-sm text-dark placeholder-gray-400 outline-none"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 flex h-8 w-10 items-center justify-center rounded-md bg-primary text-white"
              >
                <Search size={16} />
              </button>
            </div>
          </form>
          <nav className="mt-3 flex flex-col gap-1">
            <Link
              href="/products"
              className="rounded-lg px-3 py-2 text-sm transition hover:bg-white/10"
              onClick={() => setMobileOpen(false)}
            >
              Products
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
