"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, X, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/products");
      const data = await res.json();
      if (data.success) {
        setProducts(data.data.items);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setTitle(product.title);
      setDescription(product.description || "");
      setPrice(product.price.toString());
      setImageUrl(product.image_url || "");
      setCategory(product.category || "");
      setStock(product.stock.toString());
    } else {
      setEditingProduct(null);
      setTitle("");
      setDescription("");
      setPrice("");
      setImageUrl("");
      setCategory("");
      setStock("");
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("zenvyra_token");
    
    const payload = {
      title,
      description,
      price: parseFloat(price),
      image_url: imageUrl,
      category,
      stock: parseInt(stock, 10),
    };

    const url = editingProduct 
      ? `http://127.0.0.1:8000/api/products/${editingProduct.id}`
      : "http://127.0.0.1:8000/api/products";
      
    const method = editingProduct ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        closeModal();
        fetchProducts();
        toast.success("Product saved successfully");
      } else {
        const errData = await res.json().catch(() => ({}));
        toast.error(errData.detail || "Operation failed");
        console.error("Save product failed:", errData);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(`Network error: ${err.message || "Failed to fetch"}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    const token = localStorage.getItem("zenvyra_token");
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#F9FAFB]">Products</h1>
          <p className="text-[#9CA3AF] mt-1">Manage your catalog, pricing, and stock.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="h-11 px-6 bg-[#A78BFA] text-white rounded-xl font-medium shadow-[0_4px_20px_-4px_rgba(167,139,250,0.4)] hover:bg-[#B9A0FF] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      <div className="bg-[#1A1D24] border border-white/[0.04] rounded-2xl overflow-hidden shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.04] bg-white/[0.01]">
                <th className="py-4 px-6 text-sm font-medium text-[#9CA3AF]">Product</th>
                <th className="py-4 px-6 text-sm font-medium text-[#9CA3AF]">Category</th>
                <th className="py-4 px-6 text-sm font-medium text-[#9CA3AF]">Price</th>
                <th className="py-4 px-6 text-sm font-medium text-[#9CA3AF]">Stock</th>
                <th className="py-4 px-6 text-sm font-medium text-[#9CA3AF] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[#6B7280]">Loading products...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[#6B7280]">No products found.</td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        {p.image_url ? (
                          <div className="w-12 h-12 rounded-lg bg-[#22262F] flex-shrink-0 p-2 border border-white/[0.04]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={p.image_url} alt={p.title} className="w-full h-full object-contain" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-[#22262F] flex items-center justify-center border border-white/[0.04] flex-shrink-0">
                            <Package className="w-5 h-5 text-[#6B7280]" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-[#F9FAFB]">{p.title}</p>
                          <p className="text-xs text-[#6B7280] truncate max-w-[200px]">{p.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-[#D1D5DB]">{p.category || "Uncategorized"}</td>
                    <td className="py-4 px-6 text-sm font-medium text-[#F9FAFB]">${Number(p.price).toFixed(2)}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        p.stock > 10 ? "bg-emerald-400/10 text-emerald-400" : 
                        p.stock > 0 ? "bg-amber-400/10 text-amber-400" : 
                        "bg-red-400/10 text-red-400"
                      }`}>
                        {p.stock} in stock
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openModal(p)}
                          className="p-2 text-[#9CA3AF] hover:text-[#A78BFA] hover:bg-[#A78BFA]/10 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(p.id)}
                          className="p-2 text-[#9CA3AF] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0B0F1A]/80 backdrop-blur-sm"
              onClick={closeModal}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[#1A1D24] border border-white/[0.06] rounded-2xl md:rounded-3xl w-full max-w-2xl relative z-10 shadow-2xl max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/[0.06]">
                <h2 className="text-lg md:text-xl font-bold text-[#F9FAFB]">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>
                <button onClick={closeModal} className="p-2 text-[#9CA3AF] hover:text-white rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 md:p-6 overflow-y-auto">
                <form id="productForm" onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-[#9CA3AF] mb-1.5">Title</label>
                      <input 
                        type="text" required value={title} onChange={e => setTitle(e.target.value)}
                        className="w-full bg-[#22262F] border border-white/[0.06] rounded-xl px-4 py-3 text-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#A78BFA]/50"
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-[#9CA3AF] mb-1.5">Description</label>
                      <textarea 
                        rows={3} value={description} onChange={e => setDescription(e.target.value)}
                        className="w-full bg-[#22262F] border border-white/[0.06] rounded-xl px-4 py-3 text-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#A78BFA]/50 resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#9CA3AF] mb-1.5">Price ($)</label>
                      <input 
                        type="number" step="0.01" min="0" required value={price} onChange={e => setPrice(e.target.value)}
                        className="w-full bg-[#22262F] border border-white/[0.06] rounded-xl px-4 py-3 text-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#A78BFA]/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#9CA3AF] mb-1.5">Stock</label>
                      <input 
                        type="number" min="0" required value={stock} onChange={e => setStock(e.target.value)}
                        className="w-full bg-[#22262F] border border-white/[0.06] rounded-xl px-4 py-3 text-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#A78BFA]/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#9CA3AF] mb-1.5">Category</label>
                      <input 
                        type="text" value={category} onChange={e => setCategory(e.target.value)}
                        className="w-full bg-[#22262F] border border-white/[0.06] rounded-xl px-4 py-3 text-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#A78BFA]/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#9CA3AF] mb-1.5">Image URL</label>
                      <input 
                        type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)}
                        placeholder="/products/item.png"
                        className="w-full bg-[#22262F] border border-white/[0.06] rounded-xl px-4 py-3 text-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#A78BFA]/50"
                      />
                    </div>
                  </div>
                </form>
              </div>

              <div className="p-4 md:p-6 border-t border-white/[0.06] flex items-center justify-end gap-3 bg-white/[0.01]">
                <button 
                  onClick={closeModal}
                  type="button"
                  className="h-11 px-5 rounded-xl font-medium text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-white/[0.04] transition-colors flex items-center justify-center"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  form="productForm"
                  className="h-11 px-6 bg-[#A78BFA] text-white rounded-xl font-medium shadow-[0_4px_20px_-4px_rgba(167,139,250,0.4)] hover:bg-[#B9A0FF] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center"
                >
                  {editingProduct ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
