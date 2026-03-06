import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosinstance";

export default function CourseModal({ isOpen, onClose, onAddCourse }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    short_description: "",
    price: "",
    level: "",
    language: "",
    duration: "",
    total_lectures: "",
    category_id: "", // This will now store the selected ID from dropdown
    created_by: "",
    is_published: false,
  });

  const [categories, setCategories] = useState([]); // State to store categories
  const [thumbnail, setThumbnail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch categories when the modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchCategories = async () => {
        try {
          const response = await axiosInstance.get("/category/get");
          // Handle response: accessing categories array
          const data = response.data?.categories || response.data;
          setCategories(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error("Failed to load categories:", err);
          setError("Could not load categories. Please try again.");
        }
      };
      fetchCategories();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value, // Convert bool to 1/0 for backend if needed
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.category_id) {
      return setError("Course title and Category are required.");
    }

    setIsLoading(true);
    setError("");

    try {
      const payload = new FormData();
      Object.keys(formData).forEach((key) => {
        payload.append(key, formData[key]);
      });

      if (thumbnail) {
        payload.append("thumbnail", thumbnail);
      }

      const { data } = await axiosInstance.post(
        "/course/add",
        payload,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      onAddCourse?.(data);
      onClose();
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) setError("Session expired. Please login again.");
      else if (status === 403) setError("Admin privileges required.");
      else setError("Failed to create Course.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">Add New Course</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-light">×</button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter course title"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Category Dropdown - REPLACED INPUT */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Category</label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none bg-white transition"
              >
                <option value="">-- Choose Category --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none bg-white"
              >
                <option value="">Select Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none"
              />
            </div>

            {/* Total Lectures */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Lectures</label>
              <input
                type="number"
                name="total_lectures"
                value={formData.total_lectures}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none"
              />
            </div>
          </div>

          {/* Description Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
              <textarea
                name="short_description"
                rows="2"
                value={formData.short_description}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
              <textarea
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none"
              />
            </div>
          </div>

          {/* Thumbnail & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnail(e.target.files[0])}
                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-violet-100 file:text-violet-700 hover:file:bg-violet-200"
              />
            </div>
            <div className="flex items-center gap-3 pb-3">
              <input
                type="checkbox"
                name="is_published"
                checked={formData.is_published}
                onChange={handleChange}
                className="w-4 h-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
              />
              <label className="text-sm font-medium text-gray-700">Publish immediately</label>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition disabled:opacity-60"
            >
              {isLoading ? "Adding..." : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}