import React, { useState } from "react";
import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";

const SearchFilter = ({ onSearch, onFilterChange, loading }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    country: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    "Technology",
    "Design",
    "Business",
    "Language",
    "Music",
    "Sports",
    "Cooking",
    "Other",
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = { category: "", country: "" };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
    setSearchTerm("");
    onSearch("");
  };

  return (
    <div className="bg-card rounded-lg p-4 mb-6 border border-dark-600">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-dark-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for skills..."
            className="w-full pl-10 pr-4 py-2 bg-dark-700 border border-dark-600 rounded-lg font-mono text-sm text-dark-50 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-accent-500 hover:bg-accent-600 disabled:opacity-50 text-white rounded-lg transition-colors font-mono text-sm"
        >
          Search
        </button>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 bg-dark-700 hover:bg-dark-600 text-dark-100 rounded-lg transition-colors border border-dark-600 hover:border-accent-400"
        >
          <FunnelIcon className="w-4 h-4" />
        </button>
      </form>

      {/* Filters */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-dark-600">
          <div>
            <label className="block text-sm font-mono font-medium text-dark-200 mb-2">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg font-mono text-sm text-dark-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-mono font-medium text-dark-200 mb-2">
              Country
            </label>
            <input
              type="text"
              value={filters.country}
              onChange={(e) => handleFilterChange("country", e.target.value)}
              placeholder="Enter country..."
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg font-mono text-sm text-dark-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-error-500 hover:bg-error-600 text-white rounded-lg transition-colors font-mono text-sm"
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilter;
