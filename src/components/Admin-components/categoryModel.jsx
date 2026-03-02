import { useState } from "react";

import { 
  Code, Terminal, Shield, Database, Cpu, 
  Globe, Layout, Smartphone, Microscope, Binary, 
  ChevronDown 
} from "lucide-react";


const ICON_MAP = {
  Globe, Code, Cpu, Shield, Database, 
  Terminal, Layout, Smartphone, Microscope, Binary
};

const ICON_OPTIONS = [
  { name: "Web Dev", value: "Globe" },
  { name: "Software", value: "Code" },
  { name: "AI / ML", value: "Cpu" },
  { name: "Cybersecurity", value: "Shield" },
  { name: "Data Science", value: "Database" },
  { name: "Development", value: "Terminal" },
  { name: "Design", value: "Layout" },
  { name: "Mobile", value: "Smartphone" },
  { name: "Science", value: "Microscope" },
  { name: "Algorithm", value: "Binary" },
];

function CategoryModal({ isOpen, onClose, onAddCategory }) {
  const [data, setData] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(ICON_OPTIONS[0].value);

  
  const SelectedIconComponent = ICON_MAP[selectedIcon];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (data.trim() === "") return;

    onAddCategory({ 
      name: data, 
      icon: selectedIcon, 
      id: Date.now() 
    });

    setData("");
    onClose();
  };

  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 w-96 relative shadow-2xl animate-in fade-in zoom-in duration-200">
        <h3 className="text-xl font-black mb-5 text-slate-900">New Category</h3>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Category Name */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 ml-1">
              Category Name
            </label>
            <input
              type="text"
              autoFocus
              value={data}
              onChange={(e) => setData(e.target.value)}
              placeholder="e.g. Cloud Computing"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
            />
          </div>

          {/* Icon Selection with Live Preview */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 ml-1">
              Visual Icon
            </label>
            <div className="flex gap-3">
              {/* Icon Preview Box */}
              <div className="w-12 h-12 shrink-0 flex items-center justify-center bg-violet-50 text-violet-600 rounded-xl border border-violet-100">
                <SelectedIconComponent size={24} />
              </div>

              {/* Dropdown */}
              <div className="relative flex-1">
                <select
                  value={selectedIcon}
                  onChange={(e) => setSelectedIcon(e.target.value)}
                  className="w-full h-full px-4 py-2 border border-slate-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-violet-500/20 bg-white cursor-pointer"
                >
                  {ICON_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-slate-500 font-semibold hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-violet-600 text-white font-bold hover:bg-violet-700 shadow-lg shadow-violet-100 transition"
            >
              Save Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CategoryModal;