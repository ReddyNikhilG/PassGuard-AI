
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, Clipboard, Check, AlertTriangle, CheckCircle, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

interface PasswordEntry {
  id: string;
  password: string;
  timestamp: Date;
  strength: number;
}

interface PasswordHistoryProps {
  passwordHistory: PasswordEntry[];
  onClearHistory: () => void;
  onSelectPassword: (password: string) => void;
}

const PasswordHistory = ({ 
  passwordHistory, 
  onClearHistory,
  onSelectPassword 
}: PasswordHistoryProps) => {
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (password: string, id: string) => {
    navigator.clipboard.writeText(password);
    setCopiedId(id);
    
    toast({
      title: "Password copied!",
      description: "Password has been copied to clipboard",
    });
    
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStrengthLabel = (strength: number) => {
    if (strength < 25) return { label: "Weak", color: "text-strength-weak", icon: <AlertTriangle size={14} className="text-strength-weak" /> };
    if (strength < 50) return { label: "Medium", color: "text-strength-medium", icon: <AlertTriangle size={14} className="text-strength-medium" /> };
    if (strength < 75) return { label: "Good", color: "text-strength-good", icon: <CheckCircle size={14} className="text-strength-good" /> };
    return { label: "Strong", color: "text-strength-strong", icon: <CheckCircle size={14} className="text-strength-strong" /> };
  };

  return (
    <Card className="glassmorphism animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl text-primary-foreground flex items-center justify-between">
          <div className="flex items-center">
            <History className="mr-2 h-5 w-5" />
            Password History
          </div>
          {passwordHistory.length > 0 && (
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={onClearHistory}
              className="h-8"
            >
              <Trash2 size={14} className="mr-1" />
              Clear
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {passwordHistory.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground italic">
            No password history yet
          </div>
        ) : (
          <ScrollArea className="h-[240px] pr-4">
            <div className="space-y-3">
              {passwordHistory.map((entry) => {
                const { label, color, icon } = getStrengthLabel(entry.strength);
                return (
                  <div key={entry.id} className="p-3 bg-muted/30 rounded-md group">
                    <div className="flex justify-between items-start">
                      <div className="font-mono text-sm truncate max-w-[180px]">
                        {entry.password.substring(0, 3)}
                        {"•".repeat(Math.min(entry.password.length - 6, 10))}
                        {entry.password.substring(entry.password.length - 3)}
                      </div>
                      <div className="flex space-x-1">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-7 w-7" 
                          onClick={() => copyToClipboard(entry.password, entry.id)}
                        >
                          {copiedId === entry.id ? 
                            <Check size={14} className="text-green-500" /> : 
                            <Clipboard size={14} />}
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-7 w-7" 
                          onClick={() => onSelectPassword(entry.password)}
                        >
                          <CheckCircle size={14} />
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs mt-1 text-muted-foreground">
                      <span>{formatDate(entry.timestamp)}</span>
                      <div className={`flex items-center ${color}`}>
                        {icon}
                        <span className="ml-1">{label}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default PasswordHistory;
