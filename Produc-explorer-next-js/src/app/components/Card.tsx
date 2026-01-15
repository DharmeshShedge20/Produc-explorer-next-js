"use client";
import React from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import StarIcon from "@mui/icons-material/Star";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useRouter } from "next/navigation";

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

interface CardProps {
  product: ProductType;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
}

const Card: React.FC<CardProps> = ({ product, isFavorite, onToggleFavorite }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/products/${product.id}`);
  };

  return (
    <div
      className=" group relative flex flex-col w-full max-w-sm overflow-hidden rounded-2xl bg-card shadow-[0_8px_24px_rgba(15,23,42,0.10)]
            dark:shadow-[0_10px_30px_rgba(0,0,0,0.45)] hover:-translate-y-1 hover:shadow-[0_14px_40px_rgba(15,23,42,0.14)]
            dark:hover:shadow-[0_18px_50px_rgba(0,0,0,0.55)] transition-all duration-300">
      {/* Soft accent glow on hover (no border) */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{background:"radial-gradient(800px circle at 30% 10%, color-mix(in srgb, var(--accent) 14%, transparent), transparent 55%)",}}/>

      {/* Category Badge (no border) */}
      <div className="absolute top-4 left-4 z-20">
        <span className=" px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full backdrop-blur bg-background/70 dark:bg-background/40 text-foreground shadow-[0_6px_18px_rgba(15,23,42,0.10)] dark:shadow-[0_10px_22px_rgba(0,0,0,0.35)]">
          {product.category}
        </span>
      </div>

      {/* Favorite Button (no border) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(product.id);
        }}
        className={[
          "absolute top-4 right-4 z-20 p-2.5 rounded-2xl backdrop-blur transition-all duration-200",
          "shadow-[0_8px_22px_rgba(15,23,42,0.10)] dark:shadow-[0_12px_26px_rgba(0,0,0,0.40)]",
          isFavorite? "bg-background/75 dark:bg-background/40": "bg-background/65 dark:bg-background/35 hover:scale-110 text-muted",
        ].join(" ")}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        {isFavorite ? (
          <FavoriteIcon fontSize="small" style={{ color: "var(--accent)" }} />
        ) : (
          <FavoriteBorderIcon fontSize="small" />
        )}
      </button>

      {/* Image Surface (different from card, no border) */}
      <div
        onClick={handleClick}
        className=" relative h-64 w-full cursor-pointer overflow-hidden bg-background/70 dark:bg-background/35 p-10 flex items-center justify-center">
        {/* Gentle highlight on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{background:"linear-gradient(135deg, color-mix(in srgb, var(--accent) 10%, transparent), transparent 55%)"}}/>

        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 ease-out relative z-10"
        />
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col relative z-10">
        <div className="mb-2">
          <h3
            onClick={handleClick}
            className=" text-lg font-bold leading-tight cursor-pointer text-foreground hover:text-accent transition-colors line-clamp-1">
            {product.title}
          </h3>

          <div className="flex items-center gap-1.5 mt-2">
            <StarIcon sx={{ fontSize: 16 }} className="text-yellow-400" />
            <span className="text-sm font-bold text-foreground">{product.rating.rate}</span>
            <span className="text-xs text-muted font-medium">
              ({product.rating.count} reviews)
            </span>
          </div>
        </div>

        <p className="text-muted text-sm line-clamp-2 mb-6 leading-relaxed">
          {product.description}
        </p>

        {/* Footer (no border, use spacing + subtle divider glow) */}
        <div className="mt-auto pt-5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
              Price
            </span>

            <span className="text-2xl font-black text-foreground">
              <span className="text-sm font-bold mr-0.5" style={{ color: "var(--accent)" }}>
                $
              </span>
              {product.price.toFixed(2)}
            </span>
          </div>

          <button
            className=" flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-white transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-accent-glow"
            style={{
              background: "linear-gradient(135deg, var(--accent), var(--accent-glow))",
              boxShadow: "0 14px 28px color-mix(in srgb, var(--accent) 22%, transparent)",
            }}
          >
            <ShoppingCartIcon fontSize="small" className="transition-transform group-hover:-translate-y-0.5" />
            <span className="text-sm">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
