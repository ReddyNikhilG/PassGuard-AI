
import { useState, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react";

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const PasswordInput = ({ value, onChange, className = "" }: PasswordInputProps) => {
  const [visible, setVisible] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  return (
    <div className="password-input-wrapper">
      <Input
        type={visible ? "text" : "password"}
        value={value}
        onChange={handleChange}
        className={`pr-10 bg-muted/50 border-input/50 focus:border-primary ${className}`}
        placeholder="Enter your password"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="password-toggle-btn"
        onClick={toggleVisibility}
        tabIndex={-1}
      >
        {visible ? (
          <EyeOffIcon className="h-4 w-4" />
        ) : (
          <EyeIcon className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default PasswordInput;
