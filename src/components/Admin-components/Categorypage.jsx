// src/pages/admin/CategoryPage.jsx
import { useState } from "react";
import Sidebar from "./Components/Sidebar";
import CategoryModal from "./components/categoryModel";
import TopNavbar from "./Components/TopNavbar";


export default function CategoryPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [categories, setCategories] = useState([
    { id: 1, name: "Ai/Ml" },
    { id: 2, name: "Data Analysis" },
    { id: 3, name: "Data Science" },
  ]);
  const [modalOpen, setModalOpen] = useState(false);

  const handleAddCategory = (newCategory) => {
    setCategories((prev) => [...prev, newCategory]);
  };

  return (
    <>
    <TopNavbar />
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <main className={`flex-1 transition-all duration-300 ${collapsed ? "ml-20" : "ml-64"} p-8`}>
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-800">Categories</h1>
          <button
            onClick={() => setModalOpen(true)}
            className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
          >
            Add Category
          </button>
        </header>

        {/* Table */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-slate-100 text-left">
                <th className="p-3 text-sm font-semibold text-slate-700">ID</th>
                <th className="p-3 text-sm font-semibold text-slate-700">Category Name</th>
                <th className="p-3 text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50">
                  <td className="p-3 text-sm text-slate-600">{cat.id}</td>
                  <td className="p-3 text-sm text-slate-600">{cat.name}</td>
                  <td className="p-3 text-sm text-slate-600 flex gap-2">
                    <button className="px-3 py-1 rounded-lg bg-emerald-500 text-white text-xs hover:bg-emerald-600 transition">
                      Edit
                    </button>
                    <button
                      onClick={() => setCategories(categories.filter(c => c.id !== cat.id))}
                      className="px-3 py-1 rounded-lg bg-red-500 text-white text-xs hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <CategoryModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onAddCategory={handleAddCategory}
        />
      </main>
    </div>
  
  </>);
  
}



