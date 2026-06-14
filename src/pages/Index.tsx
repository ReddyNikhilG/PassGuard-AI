
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PasswordInput from "@/components/PasswordInput";
import StrengthMeter from "@/components/StrengthMeter";
import PasswordFeedback from "@/components/PasswordFeedback";
import PasswordGenerator from "@/components/PasswordGenerator";
import PasswordHistory from "@/components/PasswordHistory";
import CustomPasswordBuilder from "@/components/CustomPasswordBuilder";
import AIAnalysisCard from "@/components/AIAnalysisCard";
import AccountTypeSelector from "@/components/AccountTypeSelector";
import RealTimeFeedback from "@/components/RealTimeFeedback";
import CrackTimeBreakdown from "@/components/CrackTimeBreakdown";
import PassphraseEvaluator from "@/components/PassphraseEvaluator";
import { Clipboard, Check, Sparkles, AlertTriangle, Globe, Shield } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { analyzePassword, generatePasswordSuggestion } from "@/utils/passwordStrength";

// Mock for external service detection
const checkHaveIBeenPwned = (password: string): boolean => {
  // This would use the Pwned Passwords API in a real implementation
  return password.toLowerCase().includes("password") || 
         password.toLowerCase() === "123456" ||
         password.toLowerCase() === "qwerty";
};

interface PasswordEntry {
  id: string;
  password: string;
  timestamp: Date;
  strength: number;
}

const Index = () => {
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState("general");
  const [passwordAnalysis, setPasswordAnalysis] = useState(analyzePassword(""));
  const [passwordHistory, setPasswordHistory] = useState<PasswordEntry[]>([]);
  const [copied, setCopied] = useState(false);
  const [breachDetected, setBreachDetected] = useState(false);
  const [suggestedPassword, setSuggestedPassword] = useState("");
  
  // Local storage keys
  const HISTORY_STORAGE_KEY = "password-history";
  
  // Load password history from local storage
  useEffect(() => {
    const savedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        // Convert string dates back to Date objects
        const historyWithDates = parsed.map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp)
        }));
        setPasswordHistory(historyWithDates);
      } catch (error) {
        console.error("Failed to parse password history", error);
      }
    }
  }, []);
  
  // Analyze password whenever it changes or account type changes
  useEffect(() => {
    const analysis = analyzePassword(password, accountType);
    setPasswordAnalysis(analysis);
    
    // Check breach database
    if (password) {
      const isPwned = analysis.isBreached || checkHaveIBeenPwned(password);
      setBreachDetected(isPwned);
      
      if (isPwned) {
        toast({
          title: "Security Alert",
          description: "This password has appeared in data breaches!",
          variant: "destructive",
        });
      }
    } else {
      setBreachDetected(false);
    }
    
    // Generate suggested improvement
    if (password && analysis.score < 70) {
      setSuggestedPassword(generatePasswordSuggestion(password, analysis.score));
    } else {
      setSuggestedPassword("");
    }
  }, [password, accountType, toast]);
  
  // Save password history whenever it changes
  useEffect(() => {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(passwordHistory));
  }, [passwordHistory]);

  const handlePasswordChange = (newPassword: string) => {
    setPassword(newPassword);
    setCopied(false);
  };

  const copyToClipboard = () => {
    if (!password) return;
    
    navigator.clipboard.writeText(password);
    setCopied(true);
    
    toast({
      title: "Password copied!",
      description: "Password has been copied to clipboard",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  const savePassword = () => {
    if (!password) return;
    
    // Create new history entry
    const newEntry: PasswordEntry = {
      id: uuidv4(),
      password,
      timestamp: new Date(),
      strength: passwordAnalysis.score,
    };
    
    // Add to history (newest first)
    setPasswordHistory([newEntry, ...passwordHistory]);
    
    toast({
      title: "Password saved!",
      description: "Password has been added to your history",
    });
  };

  const clearHistory = () => {
    setPasswordHistory([]);
    localStorage.removeItem(HISTORY_STORAGE_KEY);
    
    toast({
      title: "History cleared",
      description: "Your password history has been cleared",
    });
  };

  const applyPasswordSuggestion = () => {
    if (!suggestedPassword) return;
    setPassword(suggestedPassword);
    
    toast({
      title: "Suggestion applied",
      description: "The suggested password has been applied",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-cybersec py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight gradient-text mb-4 animate-fade-in">
            Advanced Password Security Platform
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto animate-fade-in opacity-80">
            Analyze, strengthen, and secure your passwords with AI-powered technology.
            Get real-time feedback and intelligent suggestions to enhance your security.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="glassmorphism animate-fade-in border border-primary/10 shadow-lg">
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium mb-2">
                      Enter Password
                    </label>
                    <div className="flex space-x-2">
                      <PasswordInput
                        value={password}
                        onChange={handlePasswordChange}
                        className="flex-1"
                      />
                      <Button 
                        onClick={copyToClipboard} 
                        variant="outline" 
                        disabled={!password}
                        className="border-primary/20 hover:bg-primary/10"
                      >
                        {copied ? <Check size={16} /> : <Clipboard size={16} />}
                      </Button>
                      <Button 
                        onClick={savePassword}
                        disabled={!password}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                  
                  {/* Account Type Selector */}
                  <AccountTypeSelector 
                    selectedType={accountType}
                    onTypeChange={setAccountType}
                  />
                  
                  {/* Real-time Feedback */}
                  {password && passwordAnalysis.realTimeAdvice && (
                    <RealTimeFeedback advice={passwordAnalysis.realTimeAdvice} />
                  )}
                  
                  {breachDetected && (
                    <div className="bg-red-500/20 p-3 rounded-md flex items-center text-red-400 text-sm animate-pulse-slow">
                      <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>This password has appeared in data breaches and may be compromised!</span>
                    </div>
                  )}
                  
                  {passwordAnalysis.containsPersonalInfo && (
                    <div className="bg-amber-500/20 p-3 rounded-md flex items-center text-amber-400 text-sm">
                      <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>This password contains common personal information patterns. Avoid using personal details in your passwords.</span>
                    </div>
                  )}

                  {/* Password Strength Meter */}
                  {password && (
                    <StrengthMeter 
                      score={passwordAnalysis.score} 
                      className="mt-4" 
                      crackTimeDisplay={passwordAnalysis.crackTimeDisplay}
                      breachDetected={passwordAnalysis.isBreached}
                    />
                  )}

                  {/* Password Feedback */}
                  {password && passwordAnalysis.feedback.length > 0 && (
                    <PasswordFeedback feedbackItems={passwordAnalysis.feedback} />
                  )}
                  
                  {/* Multilingual Detection */}
                  {password && passwordAnalysis.feedback.some(f => f.message.includes("multilingual")) && (
                    <div className="p-3 rounded-md flex items-center bg-blue-500/10 text-blue-400 text-sm">
                      <Globe className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>We've detected common words from multiple languages in your password, which could make it easier to guess.</span>
                    </div>
                  )}
                  
                  {/* AI Suggestion */}
                  {suggestedPassword && (
                    <div className="mt-4 p-4 border border-primary/20 rounded-md bg-primary/5 animate-fade-in">
                      <div className="flex items-center text-sm mb-2 text-primary">
                        <Sparkles size={16} className="mr-2" />
                        <span className="font-medium">AI-Powered Suggestion</span>
                      </div>
                      <div className="font-mono mb-2">{suggestedPassword}</div>
                      <Button size="sm" onClick={applyPasswordSuggestion}>
                        Apply Suggestion
                      </Button>
                    </div>
                  )}
                  
                  {/* Requirements Badge */}
                  {password && (
                    <div className="flex items-center mt-2">
                      {passwordAnalysis.meetsRequirements ? (
                        <div className="px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-xs flex items-center">
                          <Shield className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span>Meets {accountTypes[accountType].name} requirements</span>
                        </div>
                      ) : (
                        <div className="px-3 py-1 bg-amber-500/20 text-amber-500 rounded-full text-xs flex items-center">
                          <AlertTriangle className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span>Does not meet {accountTypes[accountType].name} requirements</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Crack Time Breakdown (only show when we have a password) */}
            {password && (
              <CrackTimeBreakdown 
                password={password}
                crackTimeDisplay={passwordAnalysis.crackTimeDisplay}
                score={passwordAnalysis.score}
              />
            )}

            <AIAnalysisCard 
              password={password} 
              strengthScore={passwordAnalysis.score} 
            />
          </div>
          
          <div className="space-y-6">
            <PasswordGenerator onSelectPassword={handlePasswordChange} />
            
            {/* Add the PassphraseEvaluator component */}
            <PassphraseEvaluator onSelectPassphrase={handlePasswordChange} />
            
            <CustomPasswordBuilder onSelectPassword={handlePasswordChange} />
            
            <PasswordHistory 
              passwordHistory={passwordHistory} 
              onClearHistory={clearHistory}
              onSelectPassword={handlePasswordChange}
            />
          </div>
        </div>
        
        <footer className="text-center text-muted-foreground text-sm mt-12">
          <p>
            Password data is stored only in your browser. No passwords are transmitted to any server.
          </p>
          <p className="mt-2">
            <span className="text-primary/80">Advanced Password Security Platform</span> • © {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
};

// Make these variables available to the component
const accountTypes = {
  general: { name: 'General' },
  social: { name: 'Social Media' },
  financial: { name: 'Financial/Banking' },
  critical: { name: 'Critical Infrastructure' }
};

export default Index;
