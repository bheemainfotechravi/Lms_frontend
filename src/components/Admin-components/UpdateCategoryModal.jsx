import { useEffect, useState } from "react";

export default function UpdateCategoryModal({
  isOpen,
  onClose,
  category,
  onUpdate,
}) {
  const [name, setName] = useState("");

  // Prefill category name when modal opens
  useEffect(() => {
    if (category) {
      setName(category.name);
    }
  }, [category]);

  if (!isOpen || !category) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Category name is required");
      return;
    }

    onUpdate(category.id, name);
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-2xl w-96 shadow-lg">
        <h2 className="text-lg font-bold mb-4">Update Category</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg mb-4"
          />

          <div className="flex justify-end gap-2">
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