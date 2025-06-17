import { format, formatDistance, parseISO, isValid } from 'date-fns';

// Format date for display
export const formatDate = (date, formatString = 'MMM dd, yyyy') => {
  if (!date) return '';
  
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  
  if (!isValid(parsedDate)) return '';
  
  return format(parsedDate, formatString);
};

// Format relative time (e.g., "2 hours ago")
export const formatRelativeTime = (date) => {
  if (!date) return '';
  
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  
  if (!isValid(parsedDate)) return '';
  
  return formatDistance(parsedDate, new Date(), { addSuffix: true });
};

// Format time for display
export const formatTime = (date) => {
  if (!date) return '';
  
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  
  if (!isValid(parsedDate)) return '';
  
  return format(parsedDate, 'HH:mm');
};

// Capitalize first letter of each word
export const capitalizeWords = (str) => {
  if (!str) return '';
  
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength).trim() + '...';
};

// Generate initials from name
export const getInitials = (firstName, lastName) => {
  const first = firstName?.charAt(0)?.toUpperCase() || '';
  const last = lastName?.charAt(0)?.toUpperCase() || '';
  return `${first}${last}`;
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Generate random ID
export const generateId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function
export const throttle = (func, limit) => {
  let inThrottle;
  
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Calculate reading time
export const calculateReadingTime = (text) => {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Get avatar URL or fallback
export const getAvatarUrl = (profilePicture, firstName, lastName) => {
  if (profilePicture) {
    return profilePicture.startsWith('http') 
      ? profilePicture 
      : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${profilePicture}`;
  }
  
  // Generate a placeholder avatar with initials
  const initials = getInitials(firstName, lastName);
  const bgColor = generateColorFromText(`${firstName} ${lastName}`);
  
  return `https://ui-avatars.com/api/?name=${initials}&background=${bgColor}&color=fff&size=200`;
};

// Generate color from text (for consistent avatar colors)
const generateColorFromText = (text) => {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const colors = [
    '6366f1', '8b5cf6', 'ec4899', 'ef4444', 'f97316',
    '10b981', '06b6d4', '3b82f6', '6366f1', 'a855f7'
  ];
  
  return colors[Math.abs(hash) % colors.length];
};

// Copy text to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return true;
  }
};

// Check if user is online (last seen within 5 minutes)
export const isUserOnline = (lastSeen) => {
  if (!lastSeen) return false;
  
  const lastSeenDate = typeof lastSeen === 'string' ? parseISO(lastSeen) : lastSeen;
  const now = new Date();
  const diffInMinutes = (now - lastSeenDate) / (1000 * 60);
  
  return diffInMinutes <= 5;
};

// Format credits display
export const formatCredits = (credits) => {
  if (credits === 1) return '1 credit';
  return `${credits} credits`;
};

// Calculate session duration in human readable format
export const formatDuration = (minutes) => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return hours === 1 ? '1 hour' : `${hours} hours`;
  }
  
  return `${hours}h ${remainingMinutes}m`;
};

// Sort array of objects by property
export const sortBy = (array, property, direction = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = property.split('.').reduce((obj, key) => obj?.[key], a);
    const bVal = property.split('.').reduce((obj, key) => obj?.[key], b);
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

// Group array by property
export const groupBy = (array, property) => {
  return array.reduce((groups, item) => {
    const key = property.split('.').reduce((obj, key) => obj?.[key], item);
    const group = groups[key] || [];
    group.push(item);
    groups[key] = group;
    return groups;
  }, {});
};

// Deep clone object
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const copy = {};
    Object.keys(obj).forEach(key => {
      copy[key] = deepClone(obj[key]);
    });
    return copy;
  }
};
