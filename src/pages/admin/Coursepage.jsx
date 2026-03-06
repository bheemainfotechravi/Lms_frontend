import { useEffect, useState } from "react";
import CourseModal from "../../components/Admin-components/CourseModel";
import TopNavbar from "../../components/Admin-components/TopNavbar";
import axiosInstance, { image_URL } from "../../utils/axiosinstance";
import UpdateCourseModal from "../../components/Admin-components/UpdateCourseModal";

export default function CoursePage() {
  const [course, setCourse] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    showCourse();
  }, []);

  const handleAddCourse = (newCourse) => {
    setCourse((prev) => [...prev, newCourse]);
  };

  const showCourse = async () => {
    try {
      const res = await axiosInstance.get("admin/course/get");
      if (Array.isArray(res.data?.courses)) {
        setCourse(res.data.courses);
      }
    } catch (error) {
      console.error("Failed to load Course", error);
    }
  };

  const deleteCourse = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this Course?"
      );

      if (!confirmDelete) return;
      console.log(id)
      await axiosInstance.delete(`admin/course/delete/${id}`);

      setCourse((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Failed to delete Course", error);

      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
      } else if (error.response?.status === 403) {
        alert("Admin privileges required.");
      } else {
        alert("Failed to delete Course.");
      }
    }
  };

  const updateCourse = async (id, updatedData) => {
    try {
      console.log(id)
      await axiosInstance.patch(`admin/course/update/${id}`, updatedData);

      setCourse((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, ...updatedData } : c
        )
      );

      setUpdateModalOpen(false);
      setSelectedCourse(null);
    } catch (error) {
      console.error("Failed to update Course", error);
      alert("Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      <TopNavbar />

      <main className="p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-800">
            Courses
          </h1>
          <button
            onClick={() => setModalOpen(true)}
            className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-xl font-bold text-sm text-white hover:opacity-90 transition-opacity"
          >
            Add Course
          </button>
        </header>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-slate-100 text-left">
                <th className="p-3 text-sm font-semibold text-slate-700">ID</th>
                <th className="p-3 text-sm font-semibold text-slate-700">Thumbnail</th>
                <th className="p-3 text-sm font-semibold text-slate-700">Title</th>
                <th className="p-3 text-sm font-semibold text-slate-700">Category</th>
                <th className="p-3 text-sm font-semibold text-slate-700">Price</th>
                <th className="p-3 text-sm font-semibold text-slate-700">Level</th>
                <th className="p-3 text-sm font-semibold text-slate-700">Published</th>
                <th className="p-3 text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {course?.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">

                  <td className="p-3 text-sm text-slate-600">{c.id}</td>
                  {/* Thumbnail */}
                  <td className="p-3">
                    {c.thumbnail ? (
                      <img
                        src={`${image_URL}/uploads/${c.thumbnail}`}
                        alt={c.title}
                        className="w-16 h-12 object-cover rounded-lg border"
                      />
                    ) : (
                      <span className="text-xs text-gray-400">No Image</span>
                    )}
                  </td>

                  <td className="p-3 text-sm text-slate-600">{c.title}</td>

                  {/* Category */}
                  <td className="p-3 text-sm text-slate-600">
                    {c.category?.name || c.category_name || c.category_id}
                  </td>

                  <td className="p-3 text-sm text-slate-600">{c.price}</td>
                  <td className="p-3 text-sm text-slate-600">{c.level}</td>

                  <td className="p-3 text-sm text-slate-600">
                    {c.is_published ? "Yes" : "No"}
                  </td>

                  <td className="p-3 text-sm text-slate-600 flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedCourse(c);
                        setUpdateModalOpen(true);
                      }}
                      className="px-3 py-1 rounded-lg bg-emerald-500 text-white text-xs hover:bg-emerald-600 transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteCourse(c.id)}
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

        <CourseModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onAddCourse={handleAddCourse}
        />

        <UpdateCourseModal
          isOpen={updateModalOpen}
          onClose={() => {
            setUpdateModalOpen(false);
            setSelectedCourse(null);
          }}
          course={selectedCourse}
          onUpdate={updateCourse}
        />
      </main>
    </div>
  );
}