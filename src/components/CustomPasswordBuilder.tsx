
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Wand2, Cog, Plus, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface CustomPasswordBuilderProps {
  onSelectPassword: (password: string) => void;
}

const CustomPasswordBuilder = ({ onSelectPassword }: CustomPasswordBuilderProps) => {
  const { toast } = useToast();
  const [personalWords, setPersonalWords] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState("");
  const [customPassword, setCustomPassword] = useState("");
  
  const handleAddWord = () => {
    if (!currentWord.trim()) return;
    
    setPersonalWords([...personalWords, currentWord.trim()]);
    setCurrentWord("");
  };
  
  const handleRemoveWord = (index: number) => {
    setPersonalWords(personalWords.filter((_, i) => i !== index));
  };

  const generateCustomPassword = () => {
    if (personalWords.length === 0) {
      toast({
        title: "No words added",
        description: "Please add at least one word to generate a custom password",
        variant: "destructive"
      });
      return;
    }
    
    // Randomly select 1-2 words
    const shuffled = [...personalWords].sort(() => 0.5 - Math.random());
    const selectedWords = shuffled.slice(0, Math.min(2, personalWords.length));
    
    // Add random numbers
    const numbers = Math.floor(Math.random() * 900 + 100).toString();
    
    // Add special characters
    const specialChars = "!@#$%^&*";
    const randomSpecial = specialChars[Math.floor(Math.random() * specialChars.length)];
    
    // Capitalize some letters
    const processedWords = selectedWords.map(word => {
      return word.split('').map((char, idx) => 
        idx % 2 === 0 ? char.toUpperCase() : char
      ).join('');
    });
    
    // Combine everything
    const password = processedWords.join('') + numbers + randomSpecial;
    
    setCustomPassword(password);
  };
  
  const useCustomPassword = () => {
    if (!customPassword) return;
    onSelectPassword(customPassword);
    
    toast({
      title: "Custom password applied!",
      description: "Your personalized password has been applied",
    });
  };

  return (
    <Card className="glassmorphism animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl text-primary-foreground flex items-center">
          <Wand2 className="mr-2 h-5 w-5" />
          Custom Password Builder
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="text-sm">Add personal words or references:</div>
          <div className="flex gap-2">
            <Input 
              value={currentWord}
              onChange={(e) => setCurrentWord(e.target.value)}
              placeholder="Add a word or number"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddWord();
              }}
              className="bg-muted/50"
            />
            <Button 
              variant="secondary"
              onClick={handleAddWord}
              disabled={!currentWord.trim()}
              size="icon"
            >
              <Plus size={16} />
            </Button>
          </div>
        </div>
        
        {personalWords.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {personalWords.map((word, index) => (
              <div key={index} className="bg-muted px-2 py-1 rounded-md flex items-center text-sm">
                {word}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 ml-1"
                  onClick={() => handleRemoveWord(index)}
                >
                  <X size={12} />
                </Button>
              </div>
            ))}
          </div>
        )}
        
        {customPassword ? (
          <div className="p-3 bg-muted/30 rounded-md font-mono text-center">
            <div className="text-lg break-all">{customPassword}</div>
            <Button 
              className="mt-2"
              size="sm"
              onClick={useCustomPassword}
            >
              Use This Password
            </Button>
          </div>
        ) : (
          <div className="p-3 bg-muted/30 rounded-md font-mono text-center text-muted-foreground italic">
            Your custom password will appear here
          </div>
        )}
        
        <Button 
          variant="outline" 
          className="w-full"
          onClick={generateCustomPassword}
          disabled={personalWords.length === 0}
        >
          <Cog className="mr-2 h-4 w-4" />
          Generate Custom Password
        </Button>
      </CardContent>
    </Card>
  );
};

export default CustomPasswordBuilder;
