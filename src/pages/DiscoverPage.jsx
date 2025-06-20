import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import UserCard from "../components/Discover/UserCard";
import SearchFilter from "../components/Discover/SearchFilter";
import UserDetailModal from "../components/Discover/UserDetailModal";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import { discoverUsers } from "../utils/api";
import { themeClasses, componentPatterns, cn } from "../utils/theme";

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
    <div className={cn("min-h-screen", themeClasses.bgPrimary)}>
      {/* Hero Header Section */}
      <div
        className={cn(
          "backdrop-blur-sm border-b",
          themeClasses.bgPrimary,
          themeClasses.borderSecondary
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1
              className={cn(
                "text-5xl font-bold mb-6 font-heading leading-tight",
                "bg-gradient-to-r from-text-primary via-accent-primary to-accent-hover bg-clip-text text-transparent"
              )}
            >
              Discover Amazing Skills
            </h1>
            <p
              className={cn(
                "text-xl max-w-3xl mx-auto leading-relaxed",
                themeClasses.textSecondary
              )}
            >
              Connect with incredible people worldwide to learn from and share
              knowledge with.
              <span className={cn("font-medium", themeClasses.textAccent)}>
                {" "}
                Your next learning adventure starts here.
              </span>
            </p>
            <div className="mt-8 flex justify-center">
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
                      themeClasses.successBg
                    )}
                  ></div>
                  <span>Active Community</span>
                </div>
                <div className="flex items-center">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full mr-2",
                      "bg-accent-primary"
                    )}
                  ></div>
                  <span>Expert Teachers</span>
                </div>
                <div className="flex items-center">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full mr-2",
                      "bg-accent-muted"
                    )}
                  ></div>
                  <span>Flexible Learning</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchFilter
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          loading={searchLoading}
        />{" "}
        {users.length === 0 && !searchLoading ? (
          <div className="text-center py-20">
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
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {users.map((user) => (
                <UserCard
                  key={user._id}
                  user={user}
                  onClick={handleUserClick}
                />
              ))}
            </div>
            {searchLoading && (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            )}{" "}
            {pagination.hasMore && !searchLoading && (
              <div className="text-center">
                <button
                  onClick={handleLoadMore}
                  className={cn(
                    "inline-flex items-center px-8 py-4 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-1 hover:scale-105",
                    themeClasses.gradientAccent,
                    themeClasses.gradientHover,
                    themeClasses.textInverse,
                    themeClasses.shadowLg,
                    "hover:shadow-[var(--shadow-xl)]"
                  )}
                >
                  Load More Users
                  <svg
                    className="ml-2 w-5 h-5 group-hover:translate-y-0.5 transition-transform duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <UserDetailModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onMessage={handleMessageUser}
      />
    </div>
  );
};

export default DiscoverPage;
