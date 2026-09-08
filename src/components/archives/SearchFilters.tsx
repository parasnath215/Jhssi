// src/app/archives/components/SearchFilters.tsx
"use client";

import { useState } from "react";
import { Search, Filter, Calendar, FileText } from "lucide-react";

interface SearchFiltersProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: { year: string; type: string; category: string }) => void;
}

export default function SearchFilters({ onSearch, onFilterChange }: SearchFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    year: "all",
    type: "all",
    category: "all"
  });

  const years = ["all", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015"];
  const types = ["all", "Research Article", "Review Article", "Case Study", "Short Communication", "Editorial"];
  const categories = ["all", "Social Sciences", "Humanities", "Interdisciplinary", "Special Issues", "Conference Proceedings"];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search archives by title, author, keywords..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B4A2E] focus:border-transparent"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#6B4A2E] text-white px-6 py-2 rounded-md hover:bg-[#5A3D26] transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {/* Filters */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Year Filter */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Calendar size={16} />
            Filter by Year
          </label>
          <select
            value={filters.year}
            onChange={(e) => handleFilterChange("year", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B4A2E] focus:border-transparent"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year === "all" ? "All Years" : year}
              </option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <FileText size={16} />
            Article Type
          </label>
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange("type", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B4A2E] focus:border-transparent"
          >
            {types.map((type) => (
              <option key={type} value={type}>
                {type === "all" ? "All Types" : type}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Filter size={16} />
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B4A2E] focus:border-transparent"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex flex-wrap gap-2">
          {filters.year !== "all" && (
            <span className="inline-flex items-center gap-1 bg-[#6B4A2E]/10 text-[#6B4A2E] px-3 py-1 rounded-full text-sm">
              Year: {filters.year} ×
            </span>
          )}
          {filters.type !== "all" && (
            <span className="inline-flex items-center gap-1 bg-[#6B4A2E]/10 text-[#6B4A2E] px-3 py-1 rounded-full text-sm">
              Type: {filters.type} ×
            </span>
          )}
          {filters.category !== "all" && (
            <span className="inline-flex items-center gap-1 bg-[#6B4A2E]/10 text-[#6B4A2E] px-3 py-1 rounded-full text-sm">
              Category: {filters.category} ×
            </span>
          )}
          {Object.values(filters).some(v => v !== "all") && (
            <button
              onClick={() => {
                setFilters({ year: "all", type: "all", category: "all" });
                onFilterChange({ year: "all", type: "all", category: "all" });
              }}
              className="text-sm text-gray-600 hover:text-[#6B4A2E]"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}