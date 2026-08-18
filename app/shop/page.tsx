"use client";

import { useEffect, useMemo, useState } from "react";
import { CartDrawer } from "./components/CartDrawer";
import { CategoryFilter } from "./components/CategoryFilter";
import { ProductDetailsModal } from "./components/ProductDetailsModal";
import { ProductGrid } from "./components/ProductGrid";
import { ShopHeader } from "./components/ShopHeader";
import { ShopHero } from "./components/ShopHero";
import { SortControl } from "./components/SortControl";
import { Toast } from "./components/Toast";
import { CATEGORIES } from "./data/categories";
import { PRODUCTS } from "./data/products";
import { shopDisplay, shopSans } from "./lib/fonts";
import { shopTokens } from "./lib/tokens";
import type { CartItem, CategoryId, Product, SortOption } from "./types";

export default function ShopPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | "all">("all");
  const [sortOption, setSortOption] = useState<SortOption>("recommended");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 2200);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const visibleProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = PRODUCTS.filter((product) => {
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      if (!matchesCategory) return false;
      if (!query) return true;

      const categoryLabel = CATEGORIES.find((category) => category.id === product.category)?.label ?? "";
      const haystack = [
        product.name,
        product.brand,
        categoryLabel,
        ...product.compatibleVehicles,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });

    const sorted = [...filtered];
    switch (sortOption) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating-desc":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    return sorted;
  }, [searchQuery, selectedCategory, sortOption]);

  function addToCart(product: Product, quantity = 1) {
    setCart((current) => {
      const existing = current.find((item) => item.product.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
        );
      }
      return [...current, { product, quantity }];
    });
    setToastMessage("Added to cart");
    setSelectedProduct(null);
  }

  function increaseQuantity(productId: string) {
    setCart((current) =>
      current.map((item) => (item.product.id === productId ? { ...item, quantity: item.quantity + 1 } : item)),
    );
  }

  function decreaseQuantity(productId: string) {
    setCart((current) =>
      current
        .map((item) => (item.product.id === productId ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0),
    );
  }

  function removeFromCart(productId: string) {
    setCart((current) => current.filter((item) => item.product.id !== productId));
  }

  function clearFilters() {
    setSearchQuery("");
    setSelectedCategory("all");
  }

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  return (
    <div
      className={`${shopDisplay.variable} ${shopSans.variable} min-h-screen bg-[var(--shop-cream)]`}
      style={{ ...shopTokens, fontFamily: "var(--font-shop-sans)" }}
    >
      <ShopHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
      />

      <main>
        <ShopHero searchQuery={searchQuery} onSearchChange={setSearchQuery} />

        <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-[var(--shop-mist)]">
              Showing <span className="font-semibold text-[var(--shop-ink)]">{visibleProducts.length}</span>{" "}
              of {PRODUCTS.length} parts
            </p>
            <SortControl value={sortOption} onChange={setSortOption} />
          </div>

          <ProductGrid
            products={visibleProducts}
            onAddToCart={(product) => addToCart(product, 1)}
            onViewDetails={setSelectedProduct}
            onClearFilters={clearFilters}
          />
        </section>
      </main>

      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(product, quantity) => addToCart(product, quantity)}
      />

      <CartDrawer
        open={cartOpen}
        items={cart}
        subtotal={subtotal}
        onClose={() => setCartOpen(false)}
        onIncrease={increaseQuantity}
        onDecrease={decreaseQuantity}
        onRemove={removeFromCart}
        onContinueShopping={() => setCartOpen(false)}
      />

      <Toast message={toastMessage} />
    </div>
  );
}
