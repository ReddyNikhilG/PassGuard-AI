
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, Clipboard, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface GeneratorOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
}

interface PasswordGeneratorProps {
  onSelectPassword: (password: string) => void;
}

const PasswordGenerator = ({ onSelectPassword }: PasswordGeneratorProps) => {
  const { toast } = useToast();
  const [options, setOptions] = useState<GeneratorOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
  });
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    
    let charset = "";
    if (options.includeUppercase) charset += uppercase;
    if (options.includeLowercase) charset += lowercase;
    if (options.includeNumbers) charset += numbers;
    if (options.includeSymbols) charset += symbols;
    
    // Ensure at least one char set is selected
    if (!charset) {
      charset = lowercase;
      setOptions(prev => ({ ...prev, includeLowercase: true }));
    }
    
    let password = "";
    for (let i = 0; i < options.length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    
    setGeneratedPassword(password);
    setCopied(false);
  };

  const copyToClipboard = () => {
    if (!generatedPassword) return;
    
    navigator.clipboard.writeText(generatedPassword);
    setCopied(true);
    
    toast({
      title: "Password copied!",
      description: "Password has been copied to clipboard",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  const useGeneratedPassword = () => {
    if (!generatedPassword) return;
    onSelectPassword(generatedPassword);
    
    toast({
      title: "Password applied!",
      description: "Generated password has been applied",
    });
  };

  return (
    <Card className="glassmorphism animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl text-primary-foreground flex items-center">
          Password Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {generatedPassword ? (
          <div className="p-3 bg-muted/30 rounded-md font-mono text-center relative group">
            <div className="text-lg break-all">{generatedPassword}</div>
            <div className="absolute inset-0 bg-muted/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Button 
                size="sm" 
                variant="secondary" 
                className="mx-1" 
                onClick={copyToClipboard}
              >
                {copied ? <Check size={16} /> : <Clipboard size={16} />}
                {copied ? "Copied" : "Copy"}
              </Button>
              <Button 
                size="sm" 
                variant="secondary" 
                className="mx-1" 
                onClick={useGeneratedPassword}
              >
                Use
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-muted/30 rounded-md font-mono text-center text-muted-foreground italic">
            Generate a password to see it here
          </div>
        )}
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Password Length: {options.length}</span>
            </div>
            <Slider
              value={[options.length]}
              min={8}
              max={32}
              step={1}
              onValueChange={(value) => setOptions({ ...options, length: value[0] })}
            />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Include Uppercase</span>
              <Switch
                checked={options.includeUppercase}
                onCheckedChange={(checked) => setOptions({ ...options, includeUppercase: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Include Lowercase</span>
              <Switch
                checked={options.includeLowercase}
                onCheckedChange={(checked) => setOptions({ ...options, includeLowercase: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Include Numbers</span>
              <Switch
                checked={options.includeNumbers}
                onCheckedChange={(checked) => setOptions({ ...options, includeNumbers: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Include Symbols</span>
              <Switch
                checked={options.includeSymbols}
                onCheckedChange={(checked) => setOptions({ ...options, includeSymbols: checked })}
              />
            </div>
          </div>
          
          <Button className="w-full" onClick={generatePassword}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate New Password
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PasswordGenerator;
