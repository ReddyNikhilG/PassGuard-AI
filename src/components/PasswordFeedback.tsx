
import { AlertCircle, CheckCircle } from "lucide-react";

interface FeedbackItem {
  type: "success" | "warning" | "error";
  message: string;
}

interface PasswordFeedbackProps {
  feedbackItems: FeedbackItem[];
  className?: string;
}

const PasswordFeedback = ({ feedbackItems, className = "" }: PasswordFeedbackProps) => {
  const getIcon = (type: FeedbackItem["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle size={16} className="text-green-500 mr-2 flex-shrink-0" />;
      case "warning":
      case "error":
        return <AlertCircle size={16} className="text-amber-500 mr-2 flex-shrink-0" />;
      default:
        return null;
    }
  };

  const getTextClass = (type: FeedbackItem["type"]) => {
    switch (type) {
      case "success":
        return "text-green-500";
      case "warning":
        return "text-amber-500";
      case "error":
        return "text-red-500";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className={`password-feedback space-y-2 ${className}`}>
      {feedbackItems.map((item, index) => (
        <div key={index} className="flex items-start animate-fade-in">
          {getIcon(item.type)}
          <span className={`text-sm ${getTextClass(item.type)}`}>{item.message}</span>
        </div>
      ))}
    </div>
  );
};

export default PasswordFeedback;
