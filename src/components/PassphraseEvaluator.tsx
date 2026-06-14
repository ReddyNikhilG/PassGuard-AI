
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react";

interface PassphraseEvaluatorProps {
  onSelectPassphrase: (passphrase: string) => void;
}

const PassphraseEvaluator = ({ onSelectPassphrase }: PassphraseEvaluatorProps) => {
  const [passphrase, setPassphrase] = useState("");
  const [evaluation, setEvaluation] = useState<{
    isStrong: boolean;
    feedback: string;
  } | null>(null);
  
  const evaluatePassphrase = () => {
    if (!passphrase.trim()) {
      setEvaluation({
        isStrong: false,
        feedback: "Please enter a passphrase to evaluate."
      });
      return;
    }
    
    const words = passphrase.split(/[\s\-_.,;:!?]/).filter(w => w.length > 0);
    const uniqueWords = new Set(words);
    const hasUppercase = /[A-Z]/.test(passphrase);
    const hasNumbers = /[0-9]/.test(passphrase);
    const hasSpecial = /[^A-Za-z0-9\s]/.test(passphrase);
    
    let isStrong = true;
    let feedback = "";
    
    if (words.length < 4) {
      isStrong = false;
      feedback = "Your passphrase should contain at least 4 words for better security.";
    } else if (uniqueWords.size < words.length) {
      isStrong = false;
      feedback = "Avoid repeating words in your passphrase.";
    } else if (passphrase.length < 15) {
      isStrong = false;
      feedback = "Your passphrase is too short. Consider using longer words or more words.";
    } else if (!hasUppercase && !hasNumbers && !hasSpecial) {
      isStrong = false;
      feedback = "Consider adding uppercase letters, numbers, or special characters to strengthen your passphrase.";
    } else {
      isStrong = true;
      feedback = "Great passphrase! It's long, unique, and complex enough to be secure.";
    }
    
    setEvaluation({ isStrong, feedback });
  };
  
  const generatePassphrase = () => {
    // Word lists for generating random passphrases
    const nouns = ["apple", "mountain", "river", "chair", "coffee", "beach", "computer", "piano", "eagle", "diamond", "forest", "ocean"];
    const adjectives = ["happy", "brave", "clever", "gentle", "mighty", "peaceful", "vibrant", "wild", "ancient", "brilliant", "cosmic", "dazzling"];
    const verbs = ["jumps", "flows", "creates", "builds", "flies", "swims", "dances", "sings", "explores", "discovers", "transforms", "illuminates"];
    const adverbs = ["quickly", "silently", "boldly", "carefully", "proudly", "smoothly", "gracefully", "fiercely", "endlessly", "magically"];
    
    // Create a random 4-word passphrase
    const adj1 = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun1 = nouns[Math.floor(Math.random() * nouns.length)];
    const verb = verbs[Math.floor(Math.random() * verbs.length)];
    const adverb = adverbs[Math.floor(Math.random() * adverbs.length)];
    
    // Capitalize first letter randomly
    const capitalizeRandom = (word: string) => {
      return Math.random() > 0.5 ? word.charAt(0).toUpperCase() + word.slice(1) : word;
    };
    
    // Add a number or special character
    const addSpecial = () => {
      const specials = ["!", "@", "#", "$", "%", "&", "*"];
      const numbers = ["2", "3", "4", "5", "6", "7", "8", "9"];
      
      if (Math.random() > 0.5) {
        return specials[Math.floor(Math.random() * specials.length)];
      } else {
        return numbers[Math.floor(Math.random() * numbers.length)];
      }
    };
    
    // Generate the passphrase
    const newPassphrase = `${capitalizeRandom(adj1)} ${capitalizeRandom(noun1)} ${verb} ${adverb}${addSpecial()}`;
    
    setPassphrase(newPassphrase);
    setEvaluation({
      isStrong: true,
      feedback: "This generated passphrase is strong and memorable!"
    });
  };
  
  const usePassphrase = () => {
    if (passphrase) {
      onSelectPassphrase(passphrase);
    }
  };
  
  return (
    <Card className="glassmorphism animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl text-primary-foreground">
          Passphrase Evaluator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Enter or generate a passphrase:</label>
          <Textarea
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            placeholder="Enter a passphrase like 'correct horse battery staple'"
            className="min-h-[60px]"
          />
        </div>
        
        {evaluation && (
          <div className={`p-3 rounded-md flex items-start text-sm ${
            evaluation.isStrong ? "bg-green-500/10 text-green-500" : "bg-amber-500/10 text-amber-500"
          }`}>
            {evaluation.isStrong ? (
              <CheckCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
            )}
            <span>{evaluation.feedback}</span>
          </div>
        )}
        
        <div className="flex space-x-2">
          <Button onClick={generatePassphrase} variant="outline" className="flex-1">
            <RefreshCw size={16} className="mr-2" />
            Generate
          </Button>
          <Button onClick={evaluatePassphrase} className="flex-1">
            Evaluate
          </Button>
          {passphrase && (
            <Button onClick={usePassphrase} variant="secondary" className="flex-1">
              Use
            </Button>
          )}
        </div>
        
        <div className="text-xs text-muted-foreground">
          <p className="mb-1">Tips for a strong passphrase:</p>
          <ul className="list-disc pl-4 space-y-0.5">
            <li>Use at least 4 random words</li>
            <li>Add uppercase letters, numbers, or symbols</li>
            <li>Avoid common phrases or quotes</li>
            <li>Make it memorable but not personal</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default PassphraseEvaluator;
