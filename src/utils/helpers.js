import {
  format,
  parseISO,
  differenceInDays,
  isAfter,
  isBefore,
} from "date-fns";

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const formatDate = (dateString, formatString = "MMM dd, yyyy") => {
  if (!dateString) return "N/A";
  try {
    return format(parseISO(dateString), formatString);
  } catch (error) {
    return "Invalid Date";
  }
};

export const formatPhone = (phone) => {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
      6
    )}`;
  }
  return phone;
};

export const isExpired = (dateString) => {
  if (!dateString) return false;
  return isBefore(parseISO(dateString), new Date());
};

export const isExpiringSoon = (dateString, days = 30) => {
  if (!dateString) return false;
  const expiryDate = parseISO(dateString);
  const today = new Date();
  const daysUntilExpiry = differenceInDays(expiryDate, today);
  return daysUntilExpiry <= days && daysUntilExpiry >= 0;
};

export const getStatusColor = (status) => {
  const statusColors = {
    active: "text-green-600 bg-green-100",
    pending: "text-yellow-600 bg-yellow-100",
    expired: "text-red-600 bg-red-100",
    cancelled: "text-gray-600 bg-gray-100",
    approved: "text-green-600 bg-green-100",
    denied: "text-red-600 bg-red-100",
    processing: "text-blue-600 bg-blue-100",
    completed: "text-green-600 bg-green-100",
    failed: "text-red-600 bg-red-100",
    draft: "text-gray-600 bg-gray-100",
  };

  return statusColors[status] || "text-gray-600 bg-gray-100";
};

export const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

export const validateFile = (
  file,
  allowedTypes = [],
  maxSize = 5 * 1024 * 1024
) => {
  const errors = [];

  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} is not allowed`);
  }

  if (file.size > maxSize) {
    errors.push(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
  }

  return errors;
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

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

export const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return 0;
  const today = new Date();
  const birthDate = parseISO(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

export const maskSensitiveData = (data, type = "default") => {
  if (!data) return "";

  switch (type) {
    case "email":
      const [username, domain] = data.split("@");
      if (username.length <= 2) return data;
      return `${username[0]}${"*".repeat(username.length - 2)}${
        username[username.length - 1]
      }@${domain}`;

    case "phone":
      if (data.length < 4) return data;
      return `${"*".repeat(data.length - 4)}${data.slice(-4)}`;

    case "ssn":
      if (data.length < 4) return data;
      return `***-**-${data.slice(-4)}`;

    default:
      if (data.length <= 4) return data;
      return `${"*".repeat(data.length - 4)}${data.slice(-4)}`;
  }
};
