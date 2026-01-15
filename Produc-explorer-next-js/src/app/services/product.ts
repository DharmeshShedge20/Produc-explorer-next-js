import axiosInstance from "@/utils/axiosInstance";

export const fetchProducts = async () => {
  try {
    const res = await axiosInstance.get("/products");
    return res.data;
  } catch (err) {
    console.error("Fetch error:", err);
  }
};

export const fetchProductById = async (productId: number) => {
  try {
    const res = await axiosInstance.get(`/products/${productId}`);
    return res.data;
  } catch (err) {
    console.error("Fetch error:", err);
  }
};
