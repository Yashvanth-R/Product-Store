import { create } from "zustand";

type Product = {
  _id?: string;
  name: string;
  price: number | string;
  image: string;
};

type ProductStore = {
  products: Product[];
  setProducts: (products: Product[]) => void;
  createProduct: (newProduct: Product) => Promise<{ success: boolean; message: string }>;
  fetchProducts: () => Promise<void>;
  deleteProduct: (pid: string) => Promise<{ success: boolean; message: string }>;
  updateProduct: (pid: string, updatedProduct: Product) => Promise<{ success: boolean; message: string }>;
};

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  setProducts: (products) => set({ products }),
  createProduct: async (newProduct) => {
    if (!newProduct.name || !newProduct.image || !newProduct.price) {
      return { success: false, message: "Please fill in all fields." };
    }
    const res = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    });
    const data = await res.json();
    set((state) => ({ products: [...state.products, data.data] }));
    return { success: true, message: "Product created successfully" };
  },
  fetchProducts: async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    set({ products: data.data });
  },
  deleteProduct: async (pid) => {
    const res = await fetch(`/api/products/${pid}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    set((state) => ({ products: state.products.filter((product) => product._id !== pid) }));
    return { success: true, message: data.message };
  },
  updateProduct: async (pid, updatedProduct) => {
    const res = await fetch(`/api/products/${pid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProduct),
    });
    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    set((state) => ({
      products: state.products.map((product) => (product._id === pid ? data.data : product)),
    }));

    return { success: true, message: data.message };
  },
}));