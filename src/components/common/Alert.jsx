import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

const Alert = ({
  type = "info",
  title,
  children,
  dismissible = false,
  onDismiss,
  className = "",
}) => {
  const types = {
    success: {
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-800",
      iconColor: "text-green-600",
      icon: CheckCircle,
    },
    error: {
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-red-800",
      iconColor: "text-red-600",
      icon: XCircle,
    },
    warning: {
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      textColor: "text-yellow-800",
      iconColor: "text-yellow-600",
      icon: AlertCircle,
    },
    info: {
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-800",
      iconColor: "text-blue-600",
      icon: Info,
    },
  };

  const config = types[type];
  const Icon = config.icon;

  return (
    <div
      className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4 ${className}`}
    >
      <div className="flex">
        <Icon
          className={`${config.iconColor} w-5 h-5 mt-0.5 mr-3 flex-shrink-0`}
        />
        <div className="flex-1">
          {title && (
            <h3 className={`${config.textColor} font-medium text-sm mb-1`}>
              {title}
            </h3>
          )}
          <div className={`${config.textColor} text-sm`}>{children}</div>
        </div>
        {dismissible && (
          <button
            onClick={onDismiss}
            className={`${config.iconColor} hover:opacity-75 ml-3`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
