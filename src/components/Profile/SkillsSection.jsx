import React from "react";
import { PlusIcon, XMarkIcon, StarIcon } from "@heroicons/react/24/outline";

const SkillsSection = ({
  skills = [],
  onAddSkill,
  onRemoveSkill,
  isEditable = true,
}) => {
  const getSkillLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case "beginner":
        return "text-yellow-400 bg-yellow-400 bg-opacity-20";
      case "intermediate":
        return "text-orange-400 bg-orange-400 bg-opacity-20";
      case "advanced":
        return "text-green-400 bg-green-400 bg-opacity-20";
      case "expert":
        return "text-purple-400 bg-purple-400 bg-opacity-20";
      default:
        return "text-accent-400 bg-accent-400 bg-opacity-20";
    }
  };

  const getSkillLevelStars = (level) => {
    switch (level?.toLowerCase()) {
      case "beginner":
        return 1;
      case "intermediate":
        return 2;
      case "advanced":
        return 3;
      case "expert":
        return 4;
      default:
        return 0;
    }
  };

  return (
    <div className="bg-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-mono font-bold text-dark-50">Skills</h2>
        {isEditable && (
          <button
            onClick={onAddSkill}
            className="flex items-center gap-2 px-3 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg transition-colors font-mono text-sm"
          >
            <PlusIcon className="w-4 h-4" />
            Add Skill
          </button>
        )}
      </div>

      {skills.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-dark-300 font-mono mb-4">No skills added yet</p>
          {isEditable && (
            <button
              onClick={onAddSkill}
              className="text-accent-400 hover:text-accent-300 font-mono text-sm underline"
            >
              Add your first skill
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.map((skill, index) => (
            <div
              key={skill.id || index}
              className="group relative bg-dark-700 rounded-lg p-4 hover:bg-dark-600 transition-colors"
            >
              {isEditable && (
                <button
                  onClick={() => onRemoveSkill(skill.id || index)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-dark-500 rounded transition-all"
                >
                  <XMarkIcon className="w-4 h-4 text-dark-300 hover:text-error-400" />
                </button>
              )}

              <div className="pr-6">
                <h3 className="font-mono font-semibold text-dark-50 mb-2">
                  {skill.name}
                </h3>

                {skill.description && (
                  <p className="text-dark-200 font-mono text-sm mb-3 leading-relaxed">
                    {skill.description}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-mono font-medium ${getSkillLevelColor(
                        skill.level
                      )}`}
                    >
                      {skill.level || "Beginner"}
                    </span>
                    <div className="flex items-center">
                      {[...Array(4)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`w-3 h-3 ${
                            i < getSkillLevelStars(skill.level)
                              ? "text-yellow-400 fill-current"
                              : "text-dark-500"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {skill.category && (
                    <span className="text-xs font-mono text-dark-400 bg-dark-600 px-2 py-1 rounded">
                      {skill.category}
                    </span>
                  )}
                </div>

                {skill.yearsOfExperience && (
                  <div className="mt-2 text-xs font-mono text-dark-300">
                    {skill.yearsOfExperience}{" "}
                    {skill.yearsOfExperience === 1 ? "year" : "years"}{" "}
                    experience
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SkillsSection;
