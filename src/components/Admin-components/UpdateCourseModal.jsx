import { useEffect, useState } from "react";

export default function UpdateCourseModal({
  isOpen,
  onClose,
  course,
  onUpdate,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    short_description: "",
    price: "",
    level: "",
    language: "",
    duration: "",
    total_lectures: "",
    category_id: "",
    is_published: false,
  });

  // Prefill data when modal opens
  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || "",
        description: course.description || "",
        short_description: course.short_description || "",
        price: course.price || "",
        level: course.level || "",
        language: course.language || "",
        duration: course.duration || "",
        total_lectures: course.total_lectures || "",
        category_id: course.category_id || "",
        is_published: course.is_published || false,
      });
    }
  }, [course]);

  if (!isOpen || !course) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Course title is required");
      return;
    }

    onUpdate(course.id, formData);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-2xl w-full max-w-2xl shadow-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold mb-6">Update Course</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Title */}
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Course Title"
            className="w-full border px-3 py-2 rounded-lg"
          />

          {/* Short Description */}
          <textarea
            name="short_description"
            value={formData.short_description}
            onChange={handleChange}
            placeholder="Short Description"
            rows="2"
            className="w-full border px-3 py-2 rounded-lg"
          />

          {/* Description */}
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Full Description"
            rows="3"
            className="w-full border px-3 py-2 rounded-lg"
          />

          {/* Grid Fields */}
          <div className="grid grid-cols-2 gap-4">

            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
              className="border px-3 py-2 rounded-lg"
            />

            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="border px-3 py-2 rounded-lg"
            >
              <option value="">Select Level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            <input
              type="text"
              name="language"
              value={formData.language}
              onChange={handleChange}
              placeholder="Language"
              className="border px-3 py-2 rounded-lg"
            />

            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="Duration"
              className="border px-3 py-2 rounded-lg"
            />

            <input
              type="number"
              name="total_lectures"
              value={formData.total_lectures}
              onChange={handleChange}
              placeholder="Total Lectures"
              className="border px-3 py-2 rounded-lg"
            />

            <input
              type="number"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              placeholder="Category ID"
              className="border px-3 py-2 rounded-lg"
            />
          </div>

          {/* Publish */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_published"
              checked={formData.is_published}
              onChange={handleChange}
            />
            <label>Published</label>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-violet-600 text-white rounded-lg"
            >
              Update
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}