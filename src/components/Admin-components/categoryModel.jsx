// src/pages/admin/components/CategoryModal.jsx
import { useState } from "react";
import axiosInstance from "../../utils/axiosinstance";

export default function CategoryModal({ isOpen, onClose, onAddCategory }) {
  const [data, setData] = useState("");

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (data.trim() === "") return;

    // const res = await axiosInstance.post("/admin/category/add", {
    //     name: data.name,
    //   });

    onAddCategory({ data, id: Date.now() });
    setData("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl p-6 w-96 relative">
        <h3 className="text-lg font-bold mb-4">Add New Category</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={data}
            onChange={(e) => setData(e.target.value)}
            placeholder="Category Name"
            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-violet-600 text-white hover:opacity-90 transition"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}