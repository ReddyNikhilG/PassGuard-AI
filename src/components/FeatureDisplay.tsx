
import React from "react";
import { 
  Brain, Shield, Globe, Lock, AlertTriangle, 
  MessageSquare, BookOpen, Clock, LucideIcon 
} from "lucide-react";

interface FeatureDisplayProps {
  title: string;
  description: string;
  details: string;
  iconName: string;
}

const FeatureDisplay = ({ title, description, details, iconName }: FeatureDisplayProps) => {
  // Map of icon names to actual icon components
  const iconMap: Record<string, React.ReactNode> = {
    "Brain": <Brain className="h-8 w-8 text-primary/80" />,
    "Shield": <Shield className="h-8 w-8 text-primary/80" />,
    "Globe": <Globe className="h-8 w-8 text-primary/80" />,
    "Lock": <Lock className="h-8 w-8 text-primary/80" />,
    "AlertTriangle": <AlertTriangle className="h-8 w-8 text-primary/80" />,
    "MessageSquare": <MessageSquare className="h-8 w-8 text-primary/80" />,
    "BookOpen": <BookOpen className="h-8 w-8 text-primary/80" />,
    "Clock": <Clock className="h-8 w-8 text-primary/80" />
  };

  return (
    <div className="flex flex-col items-center justify-start p-4 text-center">
      <div className="mb-4 p-3 rounded-full bg-primary/10 backdrop-blur-sm">
        {iconMap[iconName] || <Shield className="h-8 w-8 text-primary/80" />}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-primary-foreground">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      <div className="text-sm bg-primary/5 p-3 rounded-md text-primary-foreground/80 animate-fade-in">
        {details}
      </div>
    </div>
  );
};

export default FeatureDisplay;
