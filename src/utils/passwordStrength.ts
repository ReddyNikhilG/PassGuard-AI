import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import * as zxcvbnEn from '@zxcvbn-ts/language-en';

// Initialize zxcvbn with language options
const options = {
  translations: zxcvbnEn.translations,
  dictionary: {
    ...zxcvbnEn.dictionary,
  },
};

zxcvbnOptions.setOptions(options);

// Common personal information patterns
const commonPersonalPatterns = [
  // Names
  'john', 'mary', 'robert', 'james', 'patricia', 'michael', 'linda', 'william',
  // Common pet names
  'max', 'bella', 'charlie', 'lucy', 'cooper', 'luna', 'buddy', 'daisy',
  // Date patterns
  /\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])/, // YYMMDD
  /\d{4}/, // Years like 1990, 2000
  // Keyboard patterns
  'qwerty', 'asdfgh', '123456', 'abcdef', 'zxcvbn'
];

// Multilingual common words
const multilingualDictionary = {
  spanish: ['contraseña', 'hola', 'amigo', 'gracias', 'amor', 'casa', 'familia'],
  french: ['bonjour', 'merci', 'amour', 'maison', 'famille', 'travail', 'chat'],
  german: ['passwort', 'hallo', 'liebe', 'haus', 'familie', 'arbeit', 'katze'],
  chinese: ['nihao', 'xiexie', 'aiqing', 'jia', 'gongzuo'],
  // Add more languages as needed
};

// Simulated breached passwords database (in reality this would be a more extensive API call)
const breachedPasswords = [
  'password', 'password123', '123456', 'qwerty', 'admin', 'welcome',
  'login', 'abc123', 'letmein', 'monkey', 'dragon', 'football', 'baseball',
  'sunshine', 'iloveyou', 'trustno1', 'princess', 'master', '1234567', '12345678',
  '123456789', 'welcome1', 'admin123', 'qwerty123'
];

interface AccountType {
  name: string;
  minScore: number;
  minLength: number;
  requiresUppercase: boolean;
  requiresLowercase: boolean;
  requiresNumbers: boolean;
  requiresSymbols: boolean;
}

const accountTypes: Record<string, AccountType> = {
  general: {
    name: 'General',
    minScore: 30,
    minLength: 8,
    requiresUppercase: false,
    requiresLowercase: true,
    requiresNumbers: false,
    requiresSymbols: false
  },
  social: {
    name: 'Social Media',
    minScore: 50,
    minLength: 10,
    requiresUppercase: true,
    requiresLowercase: true,
    requiresNumbers: true,
    requiresSymbols: false
  },
  financial: {
    name: 'Financial/Banking',
    minScore: 80,
    minLength: 12,
    requiresUppercase: true,
    requiresLowercase: true,
    requiresNumbers: true,
    requiresSymbols: true
  },
  critical: {
    name: 'Critical Infrastructure',
    minScore: 90,
    minLength: 16,
    requiresUppercase: true,
    requiresLowercase: true,
    requiresNumbers: true,
    requiresSymbols: true
  }
};

// ML simulated component (in a real app, this would use a trained model)
const simulateMLStrengthPrediction = (password: string): number => {
  // This is a simplified simulation of ML analysis
  // Factors we consider that traditional methods might miss:
  
  // Base score from zxcvbn
  const baseResult = zxcvbn(password);
  let mlScore = baseResult.score / 4 * 100; // Convert to 0-100 scale
  
  // Check for slight variations of common words with substitutions
  const lowerPassword = password.toLowerCase();
  const normalizedPassword = lowerPassword
    .replace(/0/g, 'o')
    .replace(/1/g, 'i')
    .replace(/3/g, 'e')
    .replace(/4/g, 'a')
    .replace(/5/g, 's')
    .replace(/7/g, 't')
    .replace(/8/g, 'b')
    .replace(/\$/g, 's')
    .replace(/@/g, 'a');
  
  // If normalized password is much weaker, reduce score
  const normalizedResult = zxcvbn(normalizedPassword);
  if (normalizedResult.score < baseResult.score) {
    mlScore -= 15; // Penalize simple substitutions
  }
  
  // Check for repeated patterns
  if (/(.)\1{2,}/.test(password)) {
    mlScore -= 10; // Penalize repeated characters
  }
  
  // Reward truly random-looking passwords
  const entropy = calculateEntropy(password);
  if (entropy > 4) {
    mlScore += 10; // Bonus for high entropy
  }
  
  // Check for contextual relevance (simulated)
  if (containsPersonalInfo(password)) {
    mlScore -= 20; // Heavy penalty for personal info
  }

  // Check for multilingual dictionary words
  if (containsMultilingualWords(password)) {
    mlScore -= 15; // Penalty for common words in any language
  }
  
  // Passphrase detection and evaluation
  if (isPassphrase(password)) {
    const passphraseScore = evaluatePassphrase(password);
    mlScore = Math.max(mlScore, passphraseScore); // Use higher of two scores
  }
  
  // Ensure final score is within 0-100 range
  return Math.max(0, Math.min(100, mlScore));
};

// Utility functions for the ML simulation
const calculateEntropy = (password: string): number => {
  const charSet = new Set(password.split(''));
  const uniqueChars = charSet.size;
  const passwordLength = password.length;
  
  // Shannon entropy calculation (simplified)
  let entropy = 0;
  const charCounts: Record<string, number> = {};
  
  for (const char of password) {
    charCounts[char] = (charCounts[char] || 0) + 1;
  }
  
  for (const char in charCounts) {
    const probability = charCounts[char] / passwordLength;
    entropy -= probability * Math.log2(probability);
  }
  
  return entropy;
};

const containsPersonalInfo = (password: string): boolean => {
  const lowerPassword = password.toLowerCase();
  
  for (const pattern of commonPersonalPatterns) {
    if (typeof pattern === 'string') {
      if (lowerPassword.includes(pattern)) {
        return true;
      }
    } else if (pattern instanceof RegExp) {
      if (pattern.test(lowerPassword)) {
        return true;
      }
    }
  }
  
  return false;
};

const containsMultilingualWords = (password: string): boolean => {
  const lowerPassword = password.toLowerCase();
  
  for (const language in multilingualDictionary) {
    for (const word of multilingualDictionary[language as keyof typeof multilingualDictionary]) {
      if (lowerPassword.includes(word)) {
        return true;
      }
    }
  }
  
  return false;
};

const isPassphrase = (password: string): boolean => {
  // Check if password contains multiple words separated by spaces or special chars
  return password.length > 15 && /[a-z]+[^a-z]+[a-z]+/.test(password.toLowerCase());
};

const evaluatePassphrase = (passphrase: string): number => {
  // Split by spaces and special characters
  const words = passphrase.split(/[\s\-_.,;:!?]/);
  
  if (words.length < 3) {
    return 60; // Basic passphrase
  }
  
  // Check if words are varied and not common
  const uniqueWords = new Set(words.filter(w => w.length > 0));
  
  let score = 70; // Base score for passphrases
  
  // Add points for unique words
  score += uniqueWords.size * 5;
  
  // Add points for total length
  score += Math.min(20, passphrase.length / 2);
  
  // Check for capitalization and numbers in the passphrase
  if (/[A-Z]/.test(passphrase)) {
    score += 5;
  }
  
  if (/[0-9]/.test(passphrase)) {
    score += 5;
  }
  
  if (/[^A-Za-z0-9\s]/.test(passphrase)) {
    score += 5;
  }
  
  return Math.min(100, score);
};

const isBreached = (password: string): boolean => {
  // In a real implementation, this would check against an API like Have I Been Pwned
  return breachedPasswords.includes(password.toLowerCase());
};

// Calculate crack time based on complexity
const calculateCrackTime = (password: string, score: number): string => {
  const length = password.length;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  
  let charsetSize = 0;
  if (hasLower) charsetSize += 26;
  if (hasUpper) charsetSize += 26;
  if (hasDigit) charsetSize += 10;
  if (hasSpecial) charsetSize += 33;
  
  // Approaches:
  // 1. Brute force: 10^12 attempts per second (modern technology)
  // 2. Dictionary + rules: Much faster for common patterns
  
  if (score < 20) {
    return "Instant";
  } else if (score < 40) {
    return "Minutes to hours";
  } else if (score < 60) {
    return "Days to weeks";
  } else if (score < 80) {
    return "Months to years";
  } else {
    // Calculate actual time for strong passwords
    // Using simplified formula: (charset size)^length / attempts per second
    const possibleCombinations = Math.pow(charsetSize, length);
    const attemptsPerSecond = Math.pow(10, 12); // 1 trillion per second (high-end)
    const seconds = possibleCombinations / attemptsPerSecond;
    
    if (seconds < 60) {
      return "Seconds";
    } else if (seconds < 3600) {
      return "Minutes";
    } else if (seconds < 86400) {
      return "Hours";
    } else if (seconds < 2592000) {
      return "Days";
    } else if (seconds < 31536000) {
      return "Months";
    } else if (seconds < 315360000) { // 10 years
      return "Years";
    } else if (seconds < 3153600000) { // 100 years
      return "Centuries";
    } else {
      return "Millions of years+";
    }
  }
};

// Main password analysis function
interface PasswordAnalysis {
  score: number;                // 0-100 score
  normalizedScore: number;      // 0-4 score from zxcvbn
  feedback: {
    type: "success" | "warning" | "error";
    message: string;
  }[];
  crackTimeDisplay: string;     // Human readable crack time
  isBreached: boolean;          // Is in breached database
  containsPersonalInfo: boolean; // Contains common personal info
  meetsRequirements: boolean;   // Meets required security level
  accountType?: string;         // Selected account type (if any)
  realTimeAdvice?: string;      // Dynamic advice as user types
}

export const analyzePassword = (
  password: string, 
  accountType: string = 'general'
): PasswordAnalysis => {
  // For an empty password, return minimal values
  if (!password) {
    return {
      score: 0,
      normalizedScore: 0,
      feedback: [],
      crackTimeDisplay: "Instant",
      isBreached: false,
      containsPersonalInfo: false,
      meetsRequirements: false,
      realTimeAdvice: "Start typing to get password feedback"
    };
  }

  // Get account type requirements
  const requirements = accountTypes[accountType] || accountTypes.general;

  // Use zxcvbn for basic strength analysis
  const result = zxcvbn(password);
  
  // Get enhanced ML-based score
  const mlScore = simulateMLStrengthPrediction(password);
  
  // Use ML score as primary, but also consider zxcvbn's score
  const score = mlScore;
  
  // Check if password is in breached database
  const breached = isBreached(password);
  
  // Check for personal information
  const hasPersonalInfo = containsPersonalInfo(password);
  
  // Calculate time to crack
  const crackTimeDisplay = calculateCrackTime(password, score);
  
  // Generate feedback based on the result
  const feedback: PasswordAnalysis["feedback"] = [];
  
  // Add feedback on length
  if (password.length < requirements.minLength) {
    feedback.push({
      type: "error",
      message: `Password is too short (min. ${requirements.minLength} characters required for ${requirements.name} accounts)`,
    });
  } else if (password.length >= requirements.minLength + 4) {
    feedback.push({
      type: "success",
      message: "Good password length",
    });
  }
  
  // Add feedback on character types
  if (requirements.requiresUppercase && !/[A-Z]/.test(password)) {
    feedback.push({
      type: "error",
      message: `Add uppercase letters (required for ${requirements.name} accounts)`,
    });
  } else if (!/[A-Z]/.test(password)) {
    feedback.push({
      type: "warning",
      message: "Add uppercase letters for stronger password",
    });
  }
  
  if (requirements.requiresLowercase && !/[a-z]/.test(password)) {
    feedback.push({
      type: "error",
      message: `Add lowercase letters (required for ${requirements.name} accounts)`,
    });
  } else if (!/[a-z]/.test(password)) {
    feedback.push({
      type: "warning",
      message: "Add lowercase letters for stronger password",
    });
  }
  
  if (requirements.requiresNumbers && !/[0-9]/.test(password)) {
    feedback.push({
      type: "error",
      message: `Add numbers (required for ${requirements.name} accounts)`,
    });
  } else if (!/[0-9]/.test(password)) {
    feedback.push({
      type: "warning",
      message: "Add numbers for stronger password",
    });
  }
  
  if (requirements.requiresSymbols && !/[^A-Za-z0-9]/.test(password)) {
    feedback.push({
      type: "error",
      message: `Add special characters (required for ${requirements.name} accounts)`,
    });
  } else if (!/[^A-Za-z0-9]/.test(password)) {
    feedback.push({
      type: "warning",
      message: "Add special characters for stronger password",
    });
  }
  
  // Add breach warning
  if (breached) {
    feedback.push({
      type: "error",
      message: "This password appears in known data breaches and should not be used",
    });
  }
  
  // Add personal info warning
  if (hasPersonalInfo) {
    feedback.push({
      type: "error",
      message: "Password contains common personal information patterns",
    });
  }
  
  // Check for multilingual dictionary words
  if (containsMultilingualWords(password)) {
    feedback.push({
      type: "warning",
      message: "Password contains common words found in various languages",
    });
  }
  
  // Check if it's a passphrase
  if (isPassphrase(password)) {
    feedback.push({
      type: "success",
      message: "Using a passphrase is a good security practice",
    });
  }
  
  // Add any warnings from zxcvbn
  if (result.feedback.warning) {
    feedback.push({
      type: "error",
      message: result.feedback.warning,
    });
  }
  
  // Add suggestions from zxcvbn
  result.feedback.suggestions.forEach(suggestion => {
    feedback.push({
      type: "warning",
      message: suggestion,
    });
  });
  
  // Add positive feedback for strong passwords
  if (score >= 70) {
    feedback.push({
      type: "success",
      message: "Password has good strength",
    });
  }
  
  if (score >= 90) {
    feedback.push({
      type: "success",
      message: "Excellent password strength!",
    });
  }
  
  // Check if password meets account type requirements
  const meetsRequirements = (
    password.length >= requirements.minLength &&
    (!requirements.requiresUppercase || /[A-Z]/.test(password)) &&
    (!requirements.requiresLowercase || /[a-z]/.test(password)) &&
    (!requirements.requiresNumbers || /[0-9]/.test(password)) &&
    (!requirements.requiresSymbols || /[^A-Za-z0-9]/.test(password)) &&
    score >= requirements.minScore &&
    !breached
  );
  
  // Generate real-time advice based on current password state
  let realTimeAdvice = "";
  if (password.length < 8) {
    realTimeAdvice = "Make your password longer for better security";
  } else if (!/[A-Z]/.test(password) && !/[0-9]/.test(password)) {
    realTimeAdvice = "Try adding uppercase letters and numbers";
  } else if (!/[^A-Za-z0-9]/.test(password)) {
    realTimeAdvice = "Consider adding a special character like ! or @ for extra security";
  } else if (score < 60) {
    realTimeAdvice = "Your password could be stronger. Try making it longer or more complex";
  } else if (score >= 60 && score < 80) {
    realTimeAdvice = "Good password! For even better security, consider a longer passphrase";
  } else {
    realTimeAdvice = "Excellent password! It would be very difficult to crack";
  }
  
  return {
    score,
    normalizedScore: result.score,
    feedback,
    crackTimeDisplay,
    isBreached: breached,
    containsPersonalInfo: hasPersonalInfo,
    meetsRequirements,
    accountType,
    realTimeAdvice,
  };
};

export const generatePasswordSuggestion = (
  currentPassword: string, 
  currentScore: number
): string => {
  // This is a simplified implementation. In a real app, we'd use a more sophisticated
  // algorithm or integrate with an actual AI service
  
  let suggestion = currentPassword;
  
  // If password is empty or very weak, return a strong default
  if (!currentPassword || currentScore < 20) {
    // Generate a completely new strong password
    const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()-_=+";
    
    let newPassword = "";
    // Add 8-10 letters
    for (let i = 0; i < 8 + Math.floor(Math.random() * 3); i++) {
      newPassword += letters[Math.floor(Math.random() * letters.length)];
    }
    
    // Add 2-3 numbers
    for (let i = 0; i < 2 + Math.floor(Math.random() * 2); i++) {
      newPassword += numbers[Math.floor(Math.random() * numbers.length)];
    }
    
    // Add 1-2 symbols
    for (let i = 0; i < 1 + Math.floor(Math.random() * 2); i++) {
      newPassword += symbols[Math.floor(Math.random() * symbols.length)];
    }
    
    // Shuffle the password
    newPassword = newPassword.split('').sort(() => 0.5 - Math.random()).join('');
    
    return newPassword;
  }
  
  // Check if it's a passphrase
  if (isPassphrase(currentPassword)) {
    // Improve the passphrase
    const words = currentPassword.split(/[\s\-_.,;:!?]/);
    
    if (words.length < 4) {
      // Add another word if it's a short passphrase
      const additionalWords = ["secure", "protect", "shield", "guard", "defend", "safe"];
      const randomWord = additionalWords[Math.floor(Math.random() * additionalWords.length)];
      return currentPassword + " " + randomWord;
    } else {
      // Capitalize some words and add special characters
      let improved = words.map((word, index) => {
        if (index % 2 === 0 && word.length > 0) {
          return word.charAt(0).toUpperCase() + word.slice(1);
        }
        return word;
      }).join(" ");
      
      if (!/[0-9]/.test(improved)) {
        improved += " " + Math.floor(Math.random() * 100);
      }
      
      if (!/[^A-Za-z0-9\s]/.test(improved)) {
        const symbols = "!@#$%^&*";
        improved += symbols[Math.floor(Math.random() * symbols.length)];
      }
      
      return improved;
    }
  }
  
  // Otherwise improve the existing password
  
  // Add uppercase if missing
  if (!/[A-Z]/.test(suggestion)) {
    const index = Math.floor(Math.random() * suggestion.length);
    suggestion = suggestion.substring(0, index) + 
                suggestion.charAt(index).toUpperCase() + 
                suggestion.substring(index + 1);
  }
  
  // Add number if missing
  if (!/[0-9]/.test(suggestion)) {
    suggestion += Math.floor(Math.random() * 10);
  }
  
  // Add special character if missing
  if (!/[^A-Za-z0-9]/.test(suggestion)) {
    const symbols = "!@#$%^&*";
    suggestion += symbols[Math.floor(Math.random() * symbols.length)];
  }
  
  // If it's still too short, add random characters
  if (suggestion.length < 12) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    while (suggestion.length < 12) {
      suggestion += chars[Math.floor(Math.random() * chars.length)];
    }
  }
  
  // If it contains personal info, try to change it significantly
  if (containsPersonalInfo(suggestion)) {
    suggestion = suggestion.split('').sort(() => 0.5 - Math.random()).join('');
  }
  
  return suggestion;
};

// Export account types for use in the UI
export const getAccountTypes = (): Record<string, AccountType> => {
  return accountTypes;
};
