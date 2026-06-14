
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAccountTypes } from "@/utils/passwordStrength";
import { Shield } from "lucide-react";

interface AccountTypeSelectorProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
}

const AccountTypeSelector = ({ selectedType, onTypeChange }: AccountTypeSelectorProps) => {
  const accountTypes = getAccountTypes();
  
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2 mb-1">
        <Shield className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">Account Security Level</span>
      </div>
      
      <Select value={selectedType} onValueChange={onTypeChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select account type" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(accountTypes).map(([key, type]) => (
            <SelectItem key={key} value={key}>
              {type.name} {key === 'financial' || key === 'critical' ? '🔒' : ''}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <p className="text-xs text-muted-foreground mt-1">
        {selectedType === 'general' && "General accounts require basic security."}
        {selectedType === 'social' && "Social media accounts need moderate security."}
        {selectedType === 'financial' && "Financial accounts require high security standards."}
        {selectedType === 'critical' && "Critical accounts need maximum security protection."}
      </p>
    </div>
  );
};

export default AccountTypeSelector;
