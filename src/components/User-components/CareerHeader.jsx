import React, { useState } from "react";
import { FaSearch, FaMapMarkerAlt, FaChevronDown } from "react-icons/fa";

export default function CareerHeader({ onSearch, onFilterChange }) {
  const [searchData, setSearchData] = useState({ title: "", location: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...searchData, [name]: value };
    setSearchData(updatedData);
    onSearch(updatedData);
  };

  return (
    // py-10 ko kam karke py-5 kiya hai taaki upar-neeche space kam ho jaye
    <div className="w-full bg-white border-b border-slate-200 py-5 px-6 sticky top-[64px] z-40">
      <div className="max-w-[1000px] mx-auto">
        
        {/* 1. SEARCH BAR */}
        <div className="flex flex-col md:flex-row items-center bg-white border border-slate-300 rounded-[16px] shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          
          <div className="flex-1 flex items-center gap-3 px-5 py-3 border-b md:border-b-0 md:border-r border-slate-200">
            <FaSearch className="text-slate-400 text-base" />
            <input 
              type="text" 
              name="title"
              placeholder="Job title, keywords, or company" 
              className="w-full outline-none text-[14px] font-medium text-slate-800 placeholder:text-slate-400"
              value={searchData.title}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex-1 flex items-center gap-3 px-5 py-3">
            <FaMapMarkerAlt className="text-slate-400 text-base" />
            <input 
              type="text" 
              name="location"
              placeholder="indore, madhya pradesh" 
              className="w-full outline-none text-[14px] font-medium text-slate-800 placeholder:text-slate-400"
              value={searchData.location}
              onChange={handleInputChange}
            />
          </div>

          <button 
            onClick={() => onSearch(searchData)}
            className="w-full md:w-auto bg-[#E3A83C] text-white px-8 py-3 font-black text-sm hover:bg-[#c9922e] transition-all active:scale-95 md:m-1 md:rounded-[12px]"
          >
            Find jobs
          </button>
        </div>

      </div>
    </div>
  );
}