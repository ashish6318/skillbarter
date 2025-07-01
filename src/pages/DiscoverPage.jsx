import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import UserCard from "../components/Discover/UserCard";
import SearchFilter from "../components/Discover/SearchFilter";
import UserDetailModal from "../components/Discover/UserDetailModal";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import { discoverUsers } from "../utils/api";
import { themeClasses, componentPatterns, cn } from "../utils/theme";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const DiscoverPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasMore: false,
  });
  const [filters, setFilters] = useState({
    skill: "",
    category: "",
    country: "",
  });

  // Load users
  const loadUsers = async (
    page = 1,
    searchFilters = filters,
    append = false
  ) => {
    try {
      if (page === 1) setSearchLoading(true);

      const response = await discoverUsers({
        page,
        limit: 12,
        ...searchFilters,
      });
      if (response.data.success) {
        const newUsers = response.data.data || [];
        setUsers((prev) => (append ? [...prev, ...newUsers] : newUsers));
        setPagination(response.data.pagination || {});
      }
    } catch (error) {
      toast.error("Failed to load users");
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  }; // Initial load
  useEffect(() => {
    const initialLoad = async () => {
      try {
        setLoading(true);
        const response = await discoverUsers({
          page: 1,
          limit: 12,
        });

        if (response.data.success) {
          const newUsers = response.data.data || [];
          setUsers(newUsers);
          setPagination(response.data.pagination || {});
        }
      } catch (error) {
        toast.error("Failed to load users");
        console.error("Error loading users:", error);
      } finally {
        setLoading(false);
      }
    };

    initialLoad();
  }, []);

  // Handle search
  const handleSearch = (searchTerm) => {
    const newFilters = { ...filters, skill: searchTerm };
    setFilters(newFilters);
    loadUsers(1, newFilters);
  };

  // Handle filter change
  const handleFilterChange = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    loadUsers(1, updatedFilters);
  };

  // Handle load more
  const handleLoadMore = () => {
    if (pagination.hasMore && !searchLoading) {
      loadUsers(pagination.currentPage + 1, filters, true);
    }
  };

  // Handle user card click
  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };
  // Handle message user
  const handleMessageUser = (user) => {
    setIsModalOpen(false);
    // Navigate to messages page with user data
    navigate("/messages", { state: { selectedUser: user } });
  };
  if (loading) {
    return (
      <div
        className={cn(
          "min-h-screen flex items-center justify-center",
          themeClasses.bgSecondary
        )}
      >
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <motion.div
      className={cn("min-h-screen", themeClasses.bgPrimary)}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Hero Header Section */}
      <motion.div
        className={cn(
          "backdrop-blur-sm border-b",
          themeClasses.bgPrimary,
          themeClasses.borderSecondary
        )}
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            className="text-center"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h1
              className={cn(
                "text-5xl font-bold mb-6 font-['Poppins',_sans-serif] leading-tight",
                "text-transparent bg-clip-text bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 dark:from-gray-300 dark:via-gray-200 dark:to-gray-100"
              )}
              variants={itemVariants}
            >
              Discover Amazing Skills
            </motion.h1>
            <motion.p
              className={cn(
                "text-xl max-w-3xl mx-auto leading-relaxed",
                themeClasses.textSecondary
              )}
              variants={itemVariants}
            >
              Connect with incredible people worldwide to learn from and share
              knowledge with.
              <span className={cn("font-medium", themeClasses.textPrimary)}>
                {" "}
                Your next learning adventure starts here.
              </span>
            </motion.p>
            <motion.div
              className="mt-8 flex justify-center"
              variants={itemVariants}
            >
              <div
                className={cn(
                  "flex items-center space-x-8 text-sm",
                  themeClasses.textMuted
                )}
              >
                <div className="flex items-center">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full mr-2",
                      "bg-gray-600 dark:bg-gray-400"
                    )}
                  ></div>
                  <span>Active Community</span>
                </div>
                <div className="flex items-center">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full mr-2",
                      "bg-gray-700 dark:bg-gray-300"
                    )}
                  ></div>
                  <span>Expert Teachers</span>
                </div>
                <div className="flex items-center">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full mr-2",
                      "bg-gray-500 dark:bg-gray-500"
                    )}
                  ></div>
                  <span>Flexible Learning</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        variants={itemVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div variants={itemVariants}>
          <SearchFilter
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            loading={searchLoading}
          />
        </motion.div>{" "}
        {users.length === 0 && !searchLoading ? (
          <motion.div className="text-center py-20" variants={itemVariants}>
            <div
              className={cn(
                "p-12 rounded-2xl border max-w-md mx-auto transition-all duration-300",
                componentPatterns.card,
                "hover:shadow-[var(--shadow-xl)]"
              )}
            >
              <div
                className={cn(
                  "w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6",
                  themeClasses.bgTertiary,
                  themeClasses.shadowSm
                )}
              >
                <svg
                  className={cn("w-10 h-10", themeClasses.textMuted)}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3
                className={cn(
                  "text-xl font-semibold mb-3",
                  themeClasses.textPrimary
                )}
              >
                No users found
              </h3>
              <p className={cn("leading-relaxed", themeClasses.textSecondary)}>
                Try adjusting your search terms or filters to discover more
                amazing people in our community
              </p>
            </div>
          </motion.div>
        ) : (
          <>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {users.map((user, index) => (
                <motion.div
                  key={user._id}
                  variants={cardVariants}
                  custom={index}
                >
                  <UserCard user={user} onClick={handleUserClick} />
                </motion.div>
              ))}
            </motion.div>
            {searchLoading && (
              <motion.div
                className="flex justify-center py-12"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <LoadingSpinner />
              </motion.div>
            )}
            {pagination.hasMore && !searchLoading && (
              <motion.div
                className="text-center"
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <motion.button
                  onClick={handleLoadMore}
                  className={cn(
                    "inline-flex items-center px-8 py-4 rounded-xl font-medium transition-all duration-300 font-['Poppins',_sans-serif]",
                    "bg-gray-900 dark:bg-white text-white dark:text-gray-900",
                    "hover:bg-gray-800 dark:hover:bg-gray-100",
                    "shadow-lg hover:shadow-xl",
                    "border border-gray-900 dark:border-white"
                  )}
                  whileHover={{
                    scale: 1.05,
                    y: -2,
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Load More Users
                  <motion.svg
                    className="ml-2 w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    animate={{ y: [0, 3, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </motion.svg>
                </motion.button>
              </motion.div>
            )}
          </>
        )}
      </motion.div>

      <UserDetailModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onMessage={handleMessageUser}
      />
    </motion.div>
  );
};

export default DiscoverPage;
