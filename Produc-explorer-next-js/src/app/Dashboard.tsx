"use client";

import React, { useEffect, useState } from "react";
import { fetchProducts } from "./services/product";
import Card from "@/app/components/Card";
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

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

const Dashboard = () => {
    const [products, setProducts] = useState<ProductType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [favorites, setFavorites] = useState<number[]>([]);
    const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);
    const [sortOrder, setSortOrder] = useState<string>("");

    useEffect(() => {
        const savedFavorites = localStorage.getItem("favorites");
        if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
        fetchData();
    }, []);

    const toggleFavorite = (productId: number) => {
        const nextFavorites = favorites.includes(productId) ? favorites.filter((id) => id !== productId) : [...favorites, productId];
        setFavorites(nextFavorites);
        localStorage.setItem("favorites", JSON.stringify(nextFavorites));
    };

    const fetchData = async () => {
        setIsLoading(true);
        setIsError(false);
        try {
            const res = await fetchProducts();
            const productsData: ProductType[] = (res || []) as ProductType[];
            setProducts(productsData);

            const uniqueCategories: string[] = Array.from(
                new Set(productsData.map((p) => p.category))
            );
            setCategories(uniqueCategories);
        } catch (error) {
            console.error(error);
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    let filteredProducts = products.filter((product) => {
        const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
        const matchesFavorite = showFavoritesOnly ? favorites.includes(product.id) : true;
        return matchesSearch && matchesCategory && matchesFavorite;
    });
    if (sortOrder === "lowToHigh") {
        filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
    } else if (sortOrder === "highToLow") {
        filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
    }

    return (
        <div className="min-h-screen  pb-20">
            <div className="max-w-7xl mx-auto px-6">
                {/* Search + Category Filter Bar */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
                    {/* 🔍 Search Bar */}
                    <div className="relative flex-1 group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted group-focus-within:text-accent transition-colors">
                            <SearchIcon fontSize="small" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search products by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3.5 bg-card border border-border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-glow focus:border-accent transition-all placeholder:text-muted text-foreground"
                        />
                    </div>

                    {/* 🏷️ Category Dropdown */}
                    <div className="relative w-full md:w-60 group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted group-focus-within:text-accent transition-colors">
                            <FilterListIcon fontSize="small" />
                        </div>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full pl-11 pr-10 py-3.5 bg-card border border-border rounded-2xl shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-accent-glow focus:border-accent transition-all cursor-pointer text-foreground font-medium"
                        >
                            <option value="">All Categories</option>
                            {categories.map((category) => (
                                <option key={category} value={category} className="capitalize">
                                    {category}
                                </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-muted">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                            </svg>
                        </div>
                    </div>

                    {/* 💰 Sort by Price */}
                    <div className="relative w-full md:w-60 group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted group-focus-within:text-accent transition-colors">
                            <FilterListIcon fontSize="small" />
                        </div>
                        <select className="w-full pl-11 pr-10 py-3.5 bg-card border border-border rounded-2xl shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-accent-glow focus:border-accent transition-all cursor-pointer text-foreground font-medium"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}>
                            <option value="">Sort by Price</option>
                            <option value="lowToHigh">Low to High</option>
                            <option value="highToLow">High to Low</option>
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-muted">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                            </svg>
                        </div>
                    </div>

                    {/* ❤️ Favorites Toggle */}
                    <div className="flex items-center justify-start md:justify-end gap-2">
                        <input
                            type="checkbox"
                            id="favorites"
                            checked={showFavoritesOnly}
                            onChange={() => setShowFavoritesOnly((prev) => !prev)}
                            className="w-4 h-4 accent-accent cursor-pointer"
                        />
                        <label htmlFor="favorites" className="text-foreground font-medium cursor-pointer whitespace-nowrap">
                            Show Favorites Only
                        </label>
                    </div>
                </div>


                {/* Content Area */}
                {isLoading ? (
                    <div className="flex flex-col justify-center items-center h-80 space-y-4">
                        <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                        <p className="text-gray-400 font-medium animate-pulse">Loading collection...</p>
                    </div>
                ) : isError ? (
                    <div className="flex flex-col justify-center items-center h-80 text-center bg-red-50 rounded-3xl border border-red-100 p-8">
                        <ErrorOutlineIcon className="text-red-500 mb-4" sx={{ fontSize: 48 }} />
                        <h3 className="text-xl font-bold text-red-900 mb-2">Connection Error</h3>
                        <p className="text-red-600/70 mb-6 max-w-sm">We're having trouble reaching our servers. Please check your internet connection.</p>
                        <button className="px-6 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
                         onClick={fetchData}>
                            Try Again
                        </button>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="flex flex-col justify-center items-center h-80 text-center py-20">
                        <div className="bg-gray-100 p-6 rounded-full mb-4 text-gray-400">
                            <SearchIcon sx={{ fontSize: 40 }} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">No products found</h3>
                        <p className="text-gray-500">We couldn't find anything matching "{searchTerm}"</p>
                    </div>
                ) : (
                    <div>
                        <div className="flex justify-between items-end mb-6">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">
                                Showing {filteredProducts.length} Results
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {filteredProducts.map((product) => (
                                <div key={product.id} className="transform hover:-translate-y-1 transition-transform duration-300">
                                    <Card
                                        product={product}
                                        isFavorite={favorites.includes(product.id)}
                                        onToggleFavorite={toggleFavorite}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;