import React, { useEffect} from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../features/courses/courseslice";
function SectionHeader({ tag, title, highlight, desc }) {
  return (
    <div>
      <p className="text-primary text-xs font-bold tracking-widest uppercase mb-2">
        {tag}
      </p>
      <h2 className="text-4xl font-black tracking-tight mb-3 text-slate-900">
        {title}{" "}
        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text ">
          {highlight}
        </span>
      </h2>
      {desc && <p className="text-slate-700/80 text-base">{desc}</p>}
    </div>
  );
}
function CategoryCard({ cat }) {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/category/${cat.slug}`);
  };
  return (
    <button
      onClick={handleClick}
   className={[
  "group w-full rounded-2xl p-6 text-center",
"bg-gradient-to-b from-[#f3c97c] to-white-400", 
  "text-black",
  "shadow-md transition-all duration-200",
  "hover:-translate-y-1 hover:shadow-xl",
].join(" ")}
    >
      <div className="flex justify-center mb-4">
        <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow">
          <img
            src={cat.icon}
            alt={cat.name}
            className="w-7 h-7 object-contain"
          />
        </div>
      </div>
      <p className="font-bold text-xl leading-tight">
        {cat.name}
      </p>
      <p className="font-bold text-lg opacity-90 mt-1">
        {cat.count} Courses
      </p>
 
      <div className="mt-4 flex items-center justify-center gap-1 text-lg font-bold text-black">
        Explore
      </div>
 
    </button>
  );
}
const Categories = () => {
  
  const dispatch = useDispatch();
const { categories, categoriesLoading } = useSelector((state) => state.course);
  useEffect(() => {
  if (!categories.length) {
    dispatch(fetchCategories());
  }
}, [dispatch, categories.length]);
const formattedCategories = categories.map((cat) => ({
  id: cat.id,
  name: cat.name,
  count: cat.course_count || 0,
  icon: cat.icon,
  slug: cat.slug,
}));
if (categoriesLoading) {
  return <div className="text-center py-20">Loading categories...</div>;
}
 
  return (
    <section className="py-20 px-[5%] bg-gradient-to-b from-white to-[#f3c97c]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
 
          <div className="text-center sm:text-left">
            <SectionHeader
           
              title="Explore Top"
              highlight="Categories"
            />
          </div>
        </div>
 
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
         {formattedCategories.map((cat) => (
  <CategoryCard key={cat.id} cat={cat} />
))}
        </div>
      </div>
    </section>
  );
};
 
export default Categories;