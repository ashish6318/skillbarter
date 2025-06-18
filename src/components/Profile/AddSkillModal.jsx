import React, { useState } from "react";
import { XMarkIcon, StarIcon, PlusIcon } from "@heroicons/react/24/outline";

const AddSkillModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    level: "beginner",
    category: "",
    yearsOfExperience: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const skillCategories = [
    "Programming Languages",
    "Web Development",
    "Mobile Development",
    "Data Science",
    "Machine Learning",
    "DevOps",
    "Design",
    "Business",
    "Marketing",
    "Languages",
    "Music",
    "Art",
    "Sports",
    "Cooking",
    "Other",
  ];

  const skillLevels = [
    { value: "beginner", label: "Beginner", stars: 1 },
    { value: "intermediate", label: "Intermediate", stars: 2 },
    { value: "advanced", label: "Advanced", stars: 3 },
    { value: "expert", label: "Expert", stars: 4 },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Skill name is required";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    if (
      formData.yearsOfExperience &&
      (isNaN(formData.yearsOfExperience) || formData.yearsOfExperience < 0)
    ) {
      newErrors.yearsOfExperience = "Please enter a valid number of years";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const skillData = {
        ...formData,
        yearsOfExperience: formData.yearsOfExperience
          ? parseInt(formData.yearsOfExperience)
          : null,
      };
      await onSave(skillData);
      handleClose();
    } catch (error) {
      setErrors({ general: error.message || "Failed to add skill" });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      level: "beginner",
      category: "",
      yearsOfExperience: "",
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-800 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-600">
          <h2 className="text-xl font-mono font-bold text-dark-50">
            Add New Skill
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-dark-300" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.general && (
            <div className="p-4 bg-error-500 bg-opacity-10 border border-error-500 rounded-lg">
              <p className="text-error-500 font-mono text-sm">
                {errors.general}
              </p>
            </div>
          )}

          {/* Skill Name */}
          <div>
            <label className="block text-sm font-mono font-medium text-dark-200 mb-2">
              Skill Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={`w-full px-3 py-2 bg-dark-700 border rounded-lg font-mono text-sm text-dark-50 ${
                errors.name ? "border-error-500" : "border-dark-600"
              }`}
              placeholder="e.g., React.js, Guitar, Cooking"
            />
            {errors.name && (
              <p className="text-error-500 font-mono text-xs mt-1">
                {errors.name}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-mono font-medium text-dark-200 mb-2">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              className={`w-full px-3 py-2 bg-dark-700 border rounded-lg font-mono text-sm text-dark-50 ${
                errors.category ? "border-error-500" : "border-dark-600"
              }`}
            >
              <option value="">Select a category</option>
              {skillCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-error-500 font-mono text-xs mt-1">
                {errors.category}
              </p>
            )}
          </div>

          {/* Skill Level */}
          <div>
            <label className="block text-sm font-mono font-medium text-dark-200 mb-2">
              Skill Level
            </label>
            <div className="grid grid-cols-2 gap-2">
              {skillLevels.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => handleInputChange("level", level.value)}
                  className={`p-3 rounded-lg border transition-colors text-left ${
                    formData.level === level.value
                      ? "border-accent-400 bg-accent-400 bg-opacity-10"
                      : "border-dark-600 bg-dark-700 hover:bg-dark-600"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-sm text-dark-50">
                      {level.label}
                    </span>
                    <div className="flex">
                      {[...Array(4)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`w-3 h-3 ${
                            i < level.stars
                              ? "text-yellow-400 fill-current"
                              : "text-dark-500"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Years of Experience */}
          <div>
            <label className="block text-sm font-mono font-medium text-dark-200 mb-2">
              Years of Experience (optional)
            </label>
            <input
              type="number"
              min="0"
              max="50"
              value={formData.yearsOfExperience}
              onChange={(e) =>
                handleInputChange("yearsOfExperience", e.target.value)
              }
              className={`w-full px-3 py-2 bg-dark-700 border rounded-lg font-mono text-sm text-dark-50 ${
                errors.yearsOfExperience
                  ? "border-error-500"
                  : "border-dark-600"
              }`}
              placeholder="0"
            />
            {errors.yearsOfExperience && (
              <p className="text-error-500 font-mono text-xs mt-1">
                {errors.yearsOfExperience}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-mono font-medium text-dark-200 mb-2">
              Description (optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg font-mono text-sm text-dark-50 resize-none"
              placeholder="Describe your experience with this skill..."
            />
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-dark-600">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-dark-300 hover:text-dark-100 transition-colors font-mono text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-400 hover:to-accent-500 text-white rounded-lg transition-all font-mono text-sm disabled:opacity-50"
          >
            <PlusIcon className="w-4 h-4" />
            {loading ? "Adding..." : "Add Skill"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSkillModal;
