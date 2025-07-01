import React from "react";
import { PlusIcon, XMarkIcon, StarIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import {
  themeClasses,
  componentPatterns,
  cn,
  buttonVariants,
} from "../../utils/theme";

const SkillsSection = ({
  skills = [],
  onAddSkill,
  onRemoveSkill,
  isEditable = true,
}) => {
  const getSkillLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case "beginner":
        return "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/50";
      case "intermediate":
        return "text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700/50";
      case "advanced":
        return "text-gray-800 dark:text-gray-200 bg-gray-300 dark:bg-gray-600/50";
      case "expert":
        return "text-gray-900 dark:text-gray-100 bg-gray-400 dark:bg-gray-500/50";
      default:
        return cn("text-gray-600 dark:text-gray-400", themeClasses.bgTertiary);
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
    <motion.div
      className={componentPatterns.card}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2
          className={cn(
            "text-xl font-mono font-bold",
            themeClasses.textPrimary
          )}
        >
          Skills
        </h2>
        {isEditable && (
          <motion.button
            onClick={onAddSkill}
            className={cn(
              buttonVariants.primary,
              "flex items-center gap-2 text-sm"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <PlusIcon className="w-4 h-4" />
            Add Skill
          </motion.button>
        )}
      </div>{" "}
      {skills.length === 0 ? (
        <div className="text-center py-8">
          <p className={cn("font-mono mb-4", themeClasses.textSecondary)}>
            No skills added yet
          </p>
          {isEditable && (
            <motion.button
              onClick={onAddSkill}
              className={cn(
                "text-sm underline",
                themeClasses.textMuted,
                "hover:text-gray-900 dark:hover:text-gray-100"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Add your first skill
            </motion.button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.id || index}
              className={cn(
                "group relative rounded-lg p-4 transition-colors",
                themeClasses.bgSecondary,
                themeClasses.hover
              )}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              {isEditable && (
                <motion.button
                  onClick={() => onRemoveSkill(skill.id || index)}
                  className={cn(
                    "absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded transition-all",
                    themeClasses.hover
                  )}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <XMarkIcon
                    className={cn(
                      "w-4 h-4",
                      themeClasses.textMuted,
                      "hover:text-red-500 dark:hover:text-red-400"
                    )}
                  />
                </motion.button>
              )}

              <div className="pr-6">
                <h3
                  className={cn("font-semibold mb-2", themeClasses.textPrimary)}
                >
                  {skill.name}
                </h3>

                {skill.description && (
                  <p
                    className={cn(
                      "text-sm mb-3 leading-relaxed",
                      themeClasses.textSecondary
                    )}
                  >
                    {skill.description}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "px-2 py-1 rounded text-xs font-medium",
                        getSkillLevelColor(skill.level)
                      )}
                    >
                      {skill.level || "Beginner"}
                    </span>
                    <div className="flex items-center">
                      {[...Array(4)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={cn(
                            "w-3 h-3",
                            i < getSkillLevelStars(skill.level)
                              ? "text-gray-700 dark:text-gray-300 fill-current"
                              : "text-gray-400 dark:text-gray-600"
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  {skill.category && (
                    <span
                      className={cn(
                        "text-xs px-2 py-1 rounded",
                        themeClasses.textMuted,
                        themeClasses.bgTertiary
                      )}
                    >
                      {skill.category}
                    </span>
                  )}
                </div>

                {skill.yearsOfExperience && (
                  <div className={cn("mt-2 text-xs", themeClasses.textMuted)}>
                    {skill.yearsOfExperience}{" "}
                    {skill.yearsOfExperience === 1 ? "year" : "years"}{" "}
                    experience
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default SkillsSection;
