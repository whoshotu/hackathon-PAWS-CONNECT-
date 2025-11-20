const COMMON_PASSWORDS = [
  'password', 'password123', '12345678', 'qwerty', 'abc123',
  '111111', 'letmein', 'welcome', 'monkey', 'dragon',
  'master', 'sunshine', 'princess', 'football', 'shadow',
  '123456', '123456789', '1234567', '12345', '123123',
  'password1', 'qwerty123', 'iloveyou', 'admin', 'welcome1'
];

export interface PasswordStrength {
  isValid: boolean;
  score: number;
  feedback: string[];
  strength: 'weak' | 'fair' | 'good' | 'strong';
}

export function validatePassword(password: string): PasswordStrength {
  const feedback: string[] = [];
  let score = 0;

  if (password.length < 8) {
    feedback.push('Password must be at least 8 characters');
    return { isValid: false, score: 0, feedback, strength: 'weak' };
  }

  if (COMMON_PASSWORDS.some(common => password.toLowerCase().includes(common))) {
    feedback.push('This password is too common and easily guessable');
    return { isValid: false, score: 0, feedback, strength: 'weak' };
  }

  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);

  if (!hasLower || !hasUpper) {
    feedback.push('Use both uppercase and lowercase letters');
  }
  if (!hasNumber) {
    feedback.push('Include at least one number');
  }
  if (!hasSpecial) {
    feedback.push('Include at least one special character (!@#$%^&*)');
  }

  if (password.length < 12) {
    feedback.push('Consider using 12+ characters for better security');
  }

  const repeatingChars = /(.)\1{2,}/.test(password);
  if (repeatingChars) {
    feedback.push('Avoid repeating characters');
    score -= 1;
  }

  const sequentialChars = /(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(password);
  if (sequentialChars) {
    feedback.push('Avoid sequential characters');
    score -= 1;
  }

  let strength: 'weak' | 'fair' | 'good' | 'strong';
  if (score <= 2) strength = 'weak';
  else if (score === 3) strength = 'fair';
  else if (score === 4) strength = 'good';
  else strength = 'strong';

  const isValid = score >= 3 && hasLower && hasUpper && hasNumber;

  if (isValid && feedback.length === 1 && feedback[0].includes('12+ characters')) {
    feedback[0] = 'Good password! Consider 12+ characters for maximum security.';
  }

  return {
    isValid,
    score,
    feedback: feedback.length > 0 ? feedback : ['Password meets security requirements'],
    strength
  };
}

export function getPasswordStrengthColor(strength: string): string {
  switch (strength) {
    case 'weak': return 'bg-red-500';
    case 'fair': return 'bg-yellow-500';
    case 'good': return 'bg-blue-500';
    case 'strong': return 'bg-green-500';
    default: return 'bg-gray-300';
  }
}

export function getPasswordStrengthText(strength: string): string {
  switch (strength) {
    case 'weak': return 'Weak';
    case 'fair': return 'Fair';
    case 'good': return 'Good';
    case 'strong': return 'Strong';
    default: return 'Unknown';
  }
}
