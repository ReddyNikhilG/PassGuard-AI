
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Shield, AlertTriangle } from "lucide-react";

interface CrackTimeBreakdownProps {
  password: string;
  crackTimeDisplay: string;
  score: number;
}

const CrackTimeBreakdown = ({ password, crackTimeDisplay, score }: CrackTimeBreakdownProps) => {
  if (!password) {
    return null;
  }
  
  const getAttackDescription = (attackType: string): string => {
    switch (attackType) {
      case "bruteforce":
        return "Tries every possible combination of characters.";
      case "dictionary":
        return "Uses common words and variations.";
      case "hybrid":
        return "Combines dictionary words with numbers and symbols.";
      case "rainbow":
        return "Uses precomputed hash tables to find matches.";
      default:
        return "";
    }
  };
  
  // Simulate different crack times based on attack method
  const getAttackTime = (attackType: string): string => {
    if (score >= 90) return "Millions of years";
    if (score >= 80) return attackType === "bruteforce" ? "Centuries" : "Decades";
    if (score >= 70) return attackType === "bruteforce" ? "Decades" : "Years";
    if (score >= 60) return attackType === "bruteforce" ? "Years" : "Months";
    if (score >= 50) return attackType === "bruteforce" ? "Months" : "Weeks";
    if (score >= 40) return attackType === "bruteforce" ? "Weeks" : "Days";
    if (score >= 30) return attackType === "bruteforce" ? "Days" : "Hours";
    if (score >= 20) return attackType === "bruteforce" ? "Hours" : "Minutes";
    return "Seconds";
  };
  
  return (
    <Card className="mt-4 glassmorphism animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          Estimated Time to Crack
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Overall Estimate:</span>
          <span className="font-mono text-sm">{crackTimeDisplay}</span>
        </div>
        
        <div className="space-y-2">
          <div className="text-sm font-medium mb-1">By Attack Method:</div>
          {[
            { type: "bruteforce", name: "Brute Force Attack" },
            { type: "dictionary", name: "Dictionary Attack" },
            { type: "hybrid", name: "Hybrid Attack" },
            { type: "rainbow", name: "Rainbow Table Attack" }
          ].map(attack => (
            <div key={attack.type} className="flex justify-between items-center py-1 border-b border-muted/30 text-xs">
              <div>
                <span className="font-medium">{attack.name}</span>
                <p className="text-muted-foreground text-xs mt-0.5">{getAttackDescription(attack.type)}</p>
              </div>
              <span className="font-mono">{getAttackTime(attack.type)}</span>
            </div>
          ))}
        </div>
        
        {score < 60 && (
          <div className="flex items-start mt-2 p-2 bg-yellow-500/10 rounded border border-yellow-500/20 text-xs">
            <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-yellow-500">Warning</p>
              <p className="text-muted-foreground">These times assume an attacker with modern hardware. State-sponsored attackers or those with advanced resources may crack your password faster.</p>
            </div>
          </div>
        )}
        
        {score >= 80 && (
          <div className="flex items-start mt-2 p-2 bg-green-500/10 rounded border border-green-500/20 text-xs">
            <Shield className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-green-500">Excellent Security</p>
              <p className="text-muted-foreground">Your password would require massive computational resources to crack in a reasonable timeframe.</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CrackTimeBreakdown;
