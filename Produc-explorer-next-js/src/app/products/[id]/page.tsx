"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchProductById } from "@/app/services/product";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StarIcon from "@mui/icons-material/Star";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

interface ProductType {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

const Page: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const productId = Number(params.id);

  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Favorites (same storage behavior as your Dashboard)
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch {
        setFavorites([]);
      }
    }
  }, []);

  const isFavorite = useMemo(() => {
    if (!product) return false;
    return favorites.includes(product.id);
  }, [favorites, product]);

  const toggleFavorite = () => {
    if (!product) return;
   
    const nextFavorites = favorites.includes(productId)
        ? favorites.filter((id) => id !== productId)
        : [...favorites, productId];

    setFavorites(nextFavorites);
    localStorage.setItem("favorites", JSON.stringify(nextFavorites));
  };

  const getProductById = async () => {
    try {
      setLoading(true);
      const res = await fetchProductById(productId);
      setProduct(res);
    } catch {
      setError("Failed to fetch product details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) getProductById();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="w-12 h-12 border-4 border-border border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-background text-foreground">
        <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
        <p className="text-muted mb-6">{error || "We couldn't find that product."}</p>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-6 py-2 rounded-full font-semibold bg-foreground text-background hover:opacity-90 transition"
        >
          <ArrowBackIcon fontSize="small" /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="max-w-7xl mx-auto px-6 py-8 md:py-16">
        {/* Navigation */}
        <button
          onClick={() => router.back()}
          className="group flex items-center text-sm font-medium text-muted hover:text-accent transition-colors mb-10"
        >
          <ArrowBackIcon
            className="mr-2 group-hover:-translate-x-1 transition-transform"
            sx={{ fontSize: 18 }}
          />
          Back to Collection
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left: Image Card (NO borders, premium shadow) */}
          <div
            className="
              group relative rounded-2xl bg-card overflow-hidden
              shadow-[0_8px_24px_rgba(15,23,42,0.10)]
              dark:shadow-[0_10px_30px_rgba(0,0,0,0.45)]
            "
          >
            {/* Soft accent glow on hover */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{
                background:
                  "radial-gradient(900px circle at 30% 10%, color-mix(in srgb, var(--accent) 14%, transparent), transparent 55%)",
              }}
            />

            {/* Favorite Button (same as your Card style) */}
            <button
              onClick={toggleFavorite}
              className={[
                "absolute top-4 right-4 z-20 p-2.5 rounded-2xl backdrop-blur transition-all duration-200",
                "shadow-[0_8px_22px_rgba(15,23,42,0.10)] dark:shadow-[0_12px_26px_rgba(0,0,0,0.40)]",
                isFavorite
                  ? "bg-background/75 dark:bg-background/40"
                  : "bg-background/65 dark:bg-background/35 hover:scale-110 text-muted",
              ].join(" ")}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              {isFavorite ? (
                <FavoriteIcon fontSize="small" style={{ color: "var(--accent)" }} />
              ) : (
                <FavoriteBorderIcon fontSize="small" />
              )}
            </button>

            {/* Image Surface (different from card so it doesn't look flat) */}
            <div className="relative p-8 md:p-12 bg-background/70 dark:bg-background/35 flex items-center justify-center">
              <img
                src={product.image}
                alt={product.title}
                className="w-auto object-contain hover:scale-105 transition-transform duration-500 relative z-10"
              />
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="flex flex-col">
            {/* Category pill (no borders, glassy) */}
            <nav className="mb-4">
              <span
                className="
                  inline-flex items-center
                  text-xs font-bold tracking-[0.2em] uppercase
                  px-3 py-1 rounded-full backdrop-blur
                  bg-card/70 dark:bg-card/40
                  text-accent
                  shadow-[0_6px_18px_rgba(15,23,42,0.08)]
                  dark:shadow-[0_10px_22px_rgba(0,0,0,0.30)]
                "
              >
                {product.category}
              </span>
            </nav>

            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              {product.title}
            </h1>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    sx={{ fontSize: 20 }}
                    className={i < Math.floor(product.rating.rate) ? "text-yellow-400" : "text-border"}
                  />
                ))}
                <span className="ml-2 text-sm font-bold">{product.rating.rate}</span>
              </div>

              <span className="text-border">|</span>

              <span className="text-sm text-muted font-medium">
                {product.rating.count} Customer Reviews
              </span>
            </div>

            <div className="mb-8">
              <p className="text-4xl font-light">
                ${product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className="space-y-6 mb-10">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted mb-3">
                  Overview
                </h3>
                <p className="text-muted leading-relaxed text-lg italic">
                  "{product.description}"
                </p>
              </div>

              {/* Action Section */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  className="
                    flex-1 px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-3
                    text-white transition-all active:scale-95
                    focus:outline-none focus:ring-2 focus:ring-accent-glow
                  "
                  style={{
                    background: "linear-gradient(135deg, var(--accent), var(--accent-glow))",
                    boxShadow: "0 14px 28px color-mix(in srgb, var(--accent) 22%, transparent)",
                  }}
                >
                  <ShoppingCartIcon />
                  Add to Bag
                </button>
              </div>
            </div>

            {/* Features/Trust Bar (no borders, clean surface cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-3 text-muted">
                <div
                  className="
                    p-2 rounded-lg bg-card
                    shadow-[0_8px_22px_rgba(15,23,42,0.08)]
                    dark:shadow-[0_12px_26px_rgba(0,0,0,0.35)]
                    text-accent
                  "
                >
                  <LocalShippingIcon sx={{ fontSize: 20 }} />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Fast Shipping</p>
                  <p className="text-xs text-muted">Arrives in 3-5 days</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-muted">
                <div
                  className="
                    p-2 rounded-lg bg-card
                    shadow-[0_8px_22px_rgba(15,23,42,0.08)]
                    dark:shadow-[0_12px_26px_rgba(0,0,0,0.35)]
                    text-accent
                  "
                >
                  <VerifiedUserIcon sx={{ fontSize: 20 }} />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Authentic Product</p>
                  <p className="text-xs text-muted">Verified by Manufacturer</p>
                </div>
              </div>
            </div>
          </div>
          {/* /Right */}
        </div>
      </div>
    </div>
  );
};

export default Page;
