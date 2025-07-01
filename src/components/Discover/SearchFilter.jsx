import React, { useState } from "react";
import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { themeClasses, componentPatterns, cn } from "../../utils/theme";

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
    <div className={cn(componentPatterns.card, "mb-8", themeClasses.hover)}>
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <div className="flex-1 relative group">
          <MagnifyingGlassIcon
            className={cn(
              "absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5",
              themeClasses.textMuted,
              "group-focus-within:text-gray-700 dark:group-focus-within:text-gray-300",
              themeClasses.transitionColors
            )}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for skills, expertise, or keywords..."
            className={cn(
              componentPatterns.input,
              "w-full pl-12 pr-4 py-3",
              "placeholder:text-text-muted"
            )}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={cn(
            componentPatterns.buttonPrimary,
            "px-6 py-3 font-medium",
            themeClasses.disabled
          )}
        >
          Search
        </button>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "px-4 py-3 rounded-lg border font-medium",
            themeClasses.transition,
            showFilters
              ? cn(
                  "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100",
                  themeClasses.hover
                )
              : cn(
                  themeClasses.bgSecondary,
                  themeClasses.borderSecondary,
                  themeClasses.textSecondary,
                  themeClasses.hover
                )
          )}
        >
          <FunnelIcon className="w-5 h-5" />
        </button>
      </form>{" "}
      {/* Filters */}
      {showFilters && (
        <div
          className={cn(
            "grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t animate-fade-in",
            themeClasses.borderSecondary
          )}
        >
          <div>
            <label
              className={cn(
                "block text-sm font-medium mb-2",
                themeClasses.textPrimary
              )}
            >
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              className={cn(componentPatterns.input, "w-full px-4 py-3")}
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
            <label
              className={cn(
                "block text-sm font-medium mb-2",
                themeClasses.textPrimary
              )}
            >
              Country
            </label>
            <input
              type="text"
              value={filters.country}
              onChange={(e) => handleFilterChange("country", e.target.value)}
              placeholder="Enter country..."
              className={cn(
                componentPatterns.input,
                "w-full px-4 py-3",
                "placeholder:text-text-muted"
              )}
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className={cn(
                "w-full px-4 py-3 rounded-lg font-medium",
                "bg-gray-100 dark:bg-gray-800",
                "text-gray-900 dark:text-gray-100",
                "border border-gray-300 dark:border-gray-600",
                themeClasses.transition,
                "hover:bg-gray-200 dark:hover:bg-gray-700"
              )}
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
