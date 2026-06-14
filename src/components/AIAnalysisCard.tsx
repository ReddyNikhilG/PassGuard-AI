
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, AlertTriangle, Shield, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface AIAnalysisCardProps {
  password: string;
  strengthScore: number;
}

// This component represents the AI analysis section that would integrate
// with an external AI service in a real implementation
const AIAnalysisCard = ({ password, strengthScore }: AIAnalysisCardProps) => {
  const estimateCrackTime = (score: number) => {
    // Simplified crack time estimation based on score
    if (score < 20) return "Less than a second";
    if (score < 40) return "A few minutes";
    if (score < 60) return "A few days";
    if (score < 80) return "A few years";
    return "Centuries";
  };

  const crackTime = estimateCrackTime(strengthScore);
  
  // In a real implementation, this data would come from AI analysis
  const detectedPatterns = password.length > 0 ? [
    password.length < 8 ? "Short password (less than 8 characters)" : null,
    /^[a-z]+$/.test(password) ? "Only lowercase letters" : null,
    /^[A-Z]+$/.test(password) ? "Only uppercase letters" : null,
    /^\d+$/.test(password) ? "Only numbers" : null,
    /password/i.test(password) ? "Contains 'password'" : null,
    /123/.test(password) ? "Common sequence (123)" : null,
    /qwerty/i.test(password) ? "Common keyboard sequence (qwerty)" : null,
    /asdf/i.test(password) ? "Common keyboard pattern (asdf)" : null,
    password.toLowerCase() === password.toUpperCase() ? "No mixed case" : null,
    // More patterns would be detected by the AI
  ].filter(Boolean) : [];

  const hasLeakedInBreach = password.toLowerCase() === "password123" || 
                            password.toLowerCase() === "qwerty" ||
                            password.toLowerCase() === "admin123";

  return (
    <Card className="glassmorphism animate-fade-in border border-primary/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-primary-foreground flex items-center">
          <Brain className="mr-2 h-5 w-5 text-primary/80" />
          AI Password Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-2">
        {password ? (
          <>
            <div className="space-y-4">
              <div className="p-3 rounded-md bg-primary/5 border border-primary/10">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-primary/70" />
                    <span>Estimated Crack Time:</span>
                  </div>
                  <span className="font-medium text-primary-foreground">{crackTime}</span>
                </div>
              </div>
              
              {hasLeakedInBreach && (
                <div className="bg-red-500/20 p-3 rounded-md flex items-center text-red-400 text-sm border border-red-400/20">
                  <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>This password has appeared in data breaches!</span>
                </div>
              )}
              
              {detectedPatterns.length > 0 && (
                <div className="space-y-2 p-3 rounded-md bg-amber-500/10 border border-amber-500/20">
                  <h4 className="font-medium text-sm flex items-center text-amber-200">
                    <Shield className="h-4 w-4 mr-2" />
                    Detected Vulnerabilities:
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {detectedPatterns.map((pattern, index) => (
                      <li key={index} className="flex items-center">
                        <span className="text-amber-500 mr-2">•</span> {pattern}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="mt-4">
                <h4 className="font-medium text-sm mb-3 text-primary-foreground/80">Security Analysis:</h4>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Complexity</span>
                      <span>{Math.min(100, strengthScore + 10)}%</span>
                    </div>
                    <Progress value={Math.min(100, strengthScore + 10)} className="h-1" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Uniqueness</span>
                      <span>{Math.min(100, strengthScore - 5)}%</span>
                    </div>
                    <Progress value={Math.min(100, strengthScore - 5)} className="h-1" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Memorability</span>
                      <span>{Math.max(0, 100 - strengthScore/1.5)}%</span>
                    </div>
                    <Progress value={Math.max(0, 100 - strengthScore/1.5)} className="h-1" />
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-10 text-muted-foreground italic">
            Enter a password to see AI analysis
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIAnalysisCard;
