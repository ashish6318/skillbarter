import React, { useState } from "react";
import { XMarkIcon, StarIcon, PlusIcon } from "@heroicons/react/24/outline";
import {
  themeClasses,
  componentPatterns,
  cn,
  buttonVariants,
} from "../../utils/theme";

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
    <div
      className={cn(
        "fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4",
        "bg-black/50"
      )}
    >
      <div
        className={cn(
          componentPatterns.modal,
          "w-full max-w-lg max-h-[90vh] overflow-y-auto"
        )}
      >
        {/* Header */}
        <div
          className={cn(
            "flex items-center justify-between p-6 border-b",
            themeClasses.borderSecondary
          )}
        >
          <h2
            className={cn(
              "text-xl font-mono font-bold",
              themeClasses.textPrimary
            )}
          >
            Add New Skill
          </h2>
          <button
            onClick={handleClose}
            className={cn(
              "p-2 rounded-lg transition-colors",
              themeClasses.hover
            )}
          >
            <XMarkIcon className={cn("w-5 h-5", themeClasses.textMuted)} />
          </button>
        </div>{" "}
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.general && (
            <div
              className={cn(
                "p-4 rounded-lg border",
                "bg-red-500/10 border-red-500/50"
              )}
            >
              <p className={cn("text-sm", themeClasses.textPrimary)}>
                {errors.general}
              </p>
            </div>
          )}

          {/* Skill Name */}
          <div>
            <label
              className={cn(
                "block text-sm font-medium mb-2",
                themeClasses.textPrimary
              )}
            >
              Skill Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={cn(
                componentPatterns.input,
                errors.name && "border-red-500"
              )}
              placeholder="e.g., React.js, Guitar, Cooking"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label
              className={cn(
                "block text-sm font-medium mb-2",
                themeClasses.textPrimary
              )}
            >
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              className={cn(
                componentPatterns.input,
                errors.category && "border-red-500"
              )}
            >
              <option value="">Select a category</option>
              {skillCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}{" "}
            </select>
            {errors.category && (
              <p className="text-red-500 text-xs mt-1">{errors.category}</p>
            )}
          </div>

          {/* Skill Level */}
          <div>
            <label
              className={cn(
                "block text-sm font-medium mb-2",
                themeClasses.textPrimary
              )}
            >
              Skill Level
            </label>
            <div className="grid grid-cols-2 gap-2">
              {skillLevels.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => handleInputChange("level", level.value)}
                  className={cn(
                    "p-3 rounded-lg border transition-colors text-left",
                    formData.level === level.value
                      ? cn(themeClasses.bgSecondary, themeClasses.borderAccent)
                      : cn(
                          themeClasses.bgSecondary,
                          themeClasses.borderSecondary,
                          themeClasses.hover
                        )
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={cn("text-sm", themeClasses.textPrimary)}>
                      {level.label}
                    </span>
                    <div className="flex">
                      {[...Array(4)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={cn(
                            "w-3 h-3",
                            i < level.stars
                              ? "text-yellow-400 fill-current"
                              : themeClasses.textMuted
                          )}
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
            <label
              className={cn(
                "block text-sm font-medium mb-2",
                themeClasses.textPrimary
              )}
            >
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
              className={cn(
                componentPatterns.input,
                errors.yearsOfExperience && "border-red-500"
              )}
              placeholder="0"
            />
            {errors.yearsOfExperience && (
              <p className="text-red-500 text-xs mt-1">
                {errors.yearsOfExperience}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              className={cn(
                "block text-sm font-medium mb-2",
                themeClasses.textPrimary
              )}
            >
              Description (optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              className={cn(componentPatterns.input, "resize-none")}
              placeholder="Describe your experience with this skill..."
            />
          </div>
        </form>
        {/* Footer */}
        <div
          className={cn(
            "flex justify-end gap-3 p-6 border-t",
            themeClasses.borderSecondary
          )}
        >
          <button
            type="button"
            onClick={handleClose}
            className={cn(buttonVariants.secondary)}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={cn(
              buttonVariants.primary,
              "flex items-center gap-2",
              loading && "opacity-50 cursor-not-allowed"
            )}
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
