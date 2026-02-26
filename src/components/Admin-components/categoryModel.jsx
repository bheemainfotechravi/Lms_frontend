// src/pages/admin/components/CategoryModal.jsx
import { useState } from "react";
import axiosInstance from "../../utils/axiosinstance";
import Cookies from "js-cookie";

export default function CategoryModal({ isOpen, onClose, onAddCategory }) {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      return setError("Category name is required.");
    }

    setIsLoading(true);
    setError("");

    console.log(document.cookie);

    try {
      const { data } = await axiosInstance.post("/category/add", {
        name: name,
      });

      onAddCategory?.(data); // call only if exists
      setName("");
      onClose();
    } catch (err) {
      console.log(err)
      const status = err.response?.status;

      if (status === 401) {
        setError("Session expired. Please login again.");
      } else if (status === 403) {
        setError("Admin privileges required.");
      } else {
        setError("Failed to create category.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl p-6 w-96 shadow-lg">
        <h3 className="text-lg font-bold mb-4">Add New Category</h3>

        {error && (
          <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category Name"
            disabled={isLoading}
            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 rounded-xl bg-violet-600 text-white hover:opacity-90 transition disabled:opacity-60"
            >
              {isLoading ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}