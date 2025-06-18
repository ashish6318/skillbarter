import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import UserCard from "../components/Discover/UserCard";
import SearchFilter from "../components/Discover/SearchFilter";
import UserDetailModal from "../components/Discover/UserDetailModal";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import { discoverUsers } from "../utils/api";

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
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-mono font-bold text-dark-50 mb-2">
            Discover Skills
          </h1>
          <p className="text-lg text-dark-300 font-mono">
            Find amazing people to learn from and share knowledge with
          </p>
        </div>

        <SearchFilter
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          loading={searchLoading}
        />

        {users.length === 0 && !searchLoading ? (
          <div className="text-center py-12">
            <div className="bg-card rounded-lg p-8 border border-dark-600">
              <h3 className="text-lg font-mono font-medium text-dark-200 mb-2">
                No users found
              </h3>
              <p className="text-dark-400 font-mono">
                Try adjusting your search or filters
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {users.map((user) => (
                <UserCard
                  key={user._id}
                  user={user}
                  onClick={handleUserClick}
                />
              ))}
            </div>

            {searchLoading && (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            )}

            {pagination.hasMore && !searchLoading && (
              <div className="text-center">
                <button
                  onClick={handleLoadMore}
                  className="px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white rounded-lg transition-colors font-mono"
                >
                  Load More Users
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
