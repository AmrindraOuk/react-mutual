const Card = ({ children, className = "", padding = true, hover = false }) => {
  const baseClasses = "bg-white border border-gray-200 rounded-lg shadow-sm";
  const paddingClasses = padding ? "p-6" : "";
  const hoverClasses = hover ? "hover:shadow-md transition-shadow" : "";

  return (
    <div
      className={`${baseClasses} ${paddingClasses} ${hoverClasses} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
