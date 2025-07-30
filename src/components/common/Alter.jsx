import React from "react";

const Alert = ({ message, type }) => {
  const alertStyles = {
    success: "bg-green-100 border-green-400 text-green-700",
    error: "bg-red-100 border-red-400 text-red-700",
    warning: "bg-yellow-100 border-yellow-400 text-yellow-700",
  };

  return (
    <div
      className={`border-l-4 p-4 ${alertStyles[type] || alertStyles.success}`}
      role="alert"
    >
      {message}
    </div>
  );
};

export default Alert;
