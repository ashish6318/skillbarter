// Cursor-based pagination (more efficient for real-time data)
const paginateWithCursor = async (model, query = {}, options = {}) => {
  const {
    limit = 20,
    cursor = null,
    sortField = 'createdAt',
    sortOrder = -1,
    populate = ''
  } = options;
  
  // Build query
  let dbQuery = { ...query };
  
  if (cursor) {
    if (sortOrder === -1) {
      dbQuery[sortField] = { $lt: cursor };
    } else {
      dbQuery[sortField] = { $gt: cursor };
    }
  }
  
  // Execute query
  const documents = await model
    .find(dbQuery)
    .sort({ [sortField]: sortOrder })
    .limit(limit + 1) // Get one extra to check if there's more
    .populate(populate);
  
  const hasMore = documents.length > limit;
  const results = hasMore ? documents.slice(0, -1) : documents;
  
  const nextCursor = hasMore ? 
    results[results.length - 1][sortField] : null;
  
  return {
    success: true,
    data: results,
    pagination: {
      hasMore,
      nextCursor,
      limit,
      count: results.length
    }
  };
};

// Offset-based pagination (for simple cases)
const paginateWithOffset = async (model, query = {}, options = {}) => {
  const {
    page = 1,
    limit = 20,
    sortField = 'createdAt',
    sortOrder = -1,
    populate = ''
  } = options;
  
  const skip = (page - 1) * limit;
  
  const [documents, totalCount] = await Promise.all([
    model
      .find(query)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit)
      .populate(populate),
    model.countDocuments(query)
  ]);
  
  const totalPages = Math.ceil(totalCount / limit);
  
  return {
    success: true,
    data: documents,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      hasMore: page < totalPages,
      hasPrevious: page > 1,
      limit
    }
  };
};

module.exports = {
  paginateWithCursor,
  paginateWithOffset
};
