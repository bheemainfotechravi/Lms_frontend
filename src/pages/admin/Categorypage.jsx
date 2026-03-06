import { useEffect, useState } from "react";
import CategoryModal from "../../components/Admin-components/categoryModel";
import TopNavbar from "../../components/Admin-components/TopNavbar";
import axiosInstance from "../../utils/axiosinstance";
import UpdateCategoryModal from "../../components/Admin-components/UpdateCategoryModal";

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    showCategories();
  }, []);


const handleAddCategory = async (category) => {
  try {
    const formData = new FormData();
    formData.append("name", category.name);
    formData.append("icon", category.image); // MUST match multer field name

    await axiosInstance.post("admin/category/add", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

  } catch (error) {
    console.error(error);
  }
};



  const showCategories = async () => {
    try {
      const res = await axiosInstance.get("admin/category/get");
      if (Array.isArray(res.data?.categories)) {
       setCategories(res.data.categories);
      }
    } catch (error) {
      console.error("Failed to load categories", error);
    }
  };

  
  const deleteCategory = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this category?"
      );

      if (!confirmDelete) return;

      const res = await axiosInstance.delete(`admin/category/delete/${id}`, {
        withCredentials: true, 
      });
      console.log(res)

   
      setCategories((prev) => prev.filter((c) => c.id !== id));

    } catch (error) {
      console.error("Failed to delete category", error);

      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
      } else if (error.response?.status === 403) {
        alert("Admin privileges required.");
      } else {
        alert("Failed to delete category.");
      }
    }
  };

  const updateCategory = async (id, name) => {
  try {
    await axiosInstance.patch(
      `admin/category/update/${id}`,
      { name }
    );

   
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === id ? { ...cat, name } : cat
      )
    );

    setUpdateModalOpen(false);
    setSelectedCategory(null);

  } catch (error) {
    console.error("Failed to update category", error);
    alert("Update failed");
  }
};

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      <TopNavbar />

      <main className="p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-800">
            Categories
          </h1>
          <button
            onClick={() => setModalOpen(true)}
            className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
          >
            Add Category
          </button>
        </header>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-slate-100 text-left">
                <th className="p-3 text-sm font-semibold text-slate-700">ID</th>
                <th className="p-3 text-sm font-semibold text-slate-700">
                  Category Name
                </th>
                <th className="p-3 text-sm font-semibold text-slate-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50">
                  <td className="p-3 text-sm text-slate-600">{cat.id}</td>
                  <td className="p-3 text-sm text-slate-600">{cat.name}</td>
                  <td className="p-3 text-sm text-slate-600 flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedCategory(cat);
                        setUpdateModalOpen(true);
                      }}
                      className="px-3 py-1 rounded-lg bg-emerald-500 text-white text-xs hover:bg-emerald-600 transition"
                    >
                      Edit
                    </button>
                    <button
                     onClick={() => deleteCategory(cat._id)}
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
        <UpdateCategoryModal
          isOpen={updateModalOpen}
          onClose={() => {
            setUpdateModalOpen(false);
            setSelectedCategory(null);
          }}
          category={selectedCategory}
          onUpdate={updateCategory}
        />
      </main>
    </div>
  );
}
