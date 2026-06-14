
import React, { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

interface RealTimeFeedbackProps {
  advice: string;
}

const RealTimeFeedback = ({ advice }: RealTimeFeedbackProps) => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    if (advice) {
      setVisible(true);
      
      // Hide after a while if the advice doesn't change
      const timer = setTimeout(() => {
        setVisible(false);
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [advice]);
  
  if (!advice || !visible) {
    return null;
  }
  
  return (
    <div className="flex items-center text-sm my-2 p-2 bg-primary/5 border border-primary/10 rounded-md animate-fade-in">
      <Sparkles size={16} className="text-primary mr-2 flex-shrink-0" />
      <span>{advice}</span>
    </div>
  );
};

export default RealTimeFeedback;
