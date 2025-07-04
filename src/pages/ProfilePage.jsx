import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import ProfileHeader from "../components/Profile/ProfileHeader";
import SkillsSection from "../components/Profile/SkillsSection";
import ProfileEditModal from "../components/Profile/ProfileEditModal";
import AddSkillModal from "../components/Profile/AddSkillModal";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import toast from "react-hot-toast";
import { themeClasses, cn } from "../utils/theme";

const ProfilePage = () => {
  const { user, updateProfile, isLoading } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddSkillModalOpen, setIsAddSkillModalOpen] = useState(false);
  const [skills, setSkills] = useState([]);

  // Mock skills data - in real app, this would come from API
  useEffect(() => {
    // Simulate loading skills from API
    const mockSkills = user?.skills || [
      {
        id: 1,
        name: "React.js",
        description:
          "Building modern web applications with React and its ecosystem",
        level: "advanced",
        category: "Web Development",
        yearsOfExperience: 3,
      },
      {
        id: 2,
        name: "Node.js",
        description:
          "Backend development with Express.js and various databases",
        level: "intermediate",
        category: "Programming Languages",
        yearsOfExperience: 2,
      },
      {
        id: 3,
        name: "UI/UX Design",
        description: "Creating user-centered designs and prototypes",
        level: "intermediate",
        category: "Design",
        yearsOfExperience: 2,
      },
    ];
    setSkills(mockSkills);
  }, [user]);

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };
  const handleSaveProfile = async (profileData) => {
    try {
      const result = await updateProfile(profileData);
      if (result.success) {
        toast.success("Profile updated successfully!");
        setIsEditModalOpen(false);
      } else {
        toast.error(result.error || "Failed to update profile");
      }
    } catch {
      toast.error("An error occurred while updating profile");
    }
  };

  const handleAddSkill = () => {
    setIsAddSkillModalOpen(true);
  };

  const handleSaveSkill = async (skillData) => {
    try {
      // In real app, this would be an API call
      const newSkill = {
        id: Date.now(), // Temporary ID
        ...skillData,
      };
      setSkills((prev) => [...prev, newSkill]);
      toast.success("Skill added successfully!");
      setIsAddSkillModalOpen(false);
    } catch (error) {
      toast.error("Failed to add skill");
      throw error;
    }
  };
  const handleRemoveSkill = async (skillId) => {
    try {
      // In real app, this would be an API call
      setSkills((prev) => prev.filter((skill) => skill.id !== skillId));
      toast.success("Skill removed successfully!");
    } catch {
      toast.error("Failed to remove skill");
    }
  };
  if (isLoading) {
    return (
      <div
        className={cn(
          "min-h-screen flex items-center justify-center",
          themeClasses.bgPrimary
        )}
      >
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <motion.div
      className={cn("min-h-screen", themeClasses.bgPrimary)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <ProfileHeader
          user={user}
          onEdit={handleEditProfile}
          isOwnProfile={true}
        />

        {/* Skills Section */}
        <SkillsSection
          skills={skills}
          onAddSkill={handleAddSkill}
          onRemoveSkill={handleRemoveSkill}
          isEditable={true}
        />

        {/* Additional Sections can be added here */}
        {/* 
        <ReviewsSection />
        <SessionHistorySection />
        <AvailabilitySection />
        */}
      </div>

      {/* Modals */}
      <ProfileEditModal
        user={user}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveProfile}
      />

      <AddSkillModal
        isOpen={isAddSkillModalOpen}
        onClose={() => setIsAddSkillModalOpen(false)}
        onSave={handleSaveSkill}
      />
    </motion.div>
  );
};

export default ProfilePage;
