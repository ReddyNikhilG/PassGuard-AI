
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Shield, Clock, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface StrengthMeterProps {
  score: number; // 0-100
  className?: string;
  crackTimeDisplay?: string;
  breachDetected?: boolean;
}

const StrengthMeter = ({ 
  score, 
  className = "",
  crackTimeDisplay,
  breachDetected = false
}: StrengthMeterProps) => {
  const { label, color, icon } = useMemo(() => {
    if (score < 25) {
      return { 
        label: "Weak", 
        color: "bg-strength-weak", 
        icon: "text-strength-weak"
      };
    } else if (score < 50) {
      return { 
        label: "Medium", 
        color: "bg-strength-medium", 
        icon: "text-strength-medium"
      };
    } else if (score < 75) {
      return { 
        label: "Good", 
        color: "bg-strength-good", 
        icon: "text-strength-good"
      };
    } else {
      return { 
        label: "Strong", 
        color: "bg-strength-strong", 
        icon: "text-strength-strong"
      };
    }
  }, [score]);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between items-center">
        <span className="text-sm">Password Strength</span>
        <div className="flex items-center">
          <Shield className={`h-4 w-4 mr-1.5 ${icon}`} />
          <span className="font-medium text-sm">{label}</span>
        </div>
      </div>
      
      <Progress value={score} className="h-2.5" />
      
      <div className="flex justify-between text-xs text-muted-foreground pt-1">
        <span>Weak</span>
        <span>Medium</span>
        <span>Good</span>
        <span>Strong</span>
      </div>

      {crackTimeDisplay && (
        <div className="flex items-center mt-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-1.5" />
          <span>Est. crack time: <span className="font-semibold">{crackTimeDisplay}</span></span>
        </div>
      )}

      {breachDetected && (
        <div className="flex items-center mt-1 text-sm text-red-400">
          <AlertTriangle className="h-4 w-4 mr-1.5" />
          <span>This password appears in known data breaches!</span>
        </div>
      )}
    </div>
  );
};

export default StrengthMeter;
