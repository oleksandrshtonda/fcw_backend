import { HttpException } from '@nestjs/common';

export function validatePassword(password: string) {
  const messages: string[] = ['Bad request'];
  const SPECIAL_SYMBOLS: string = '!@#$%^&*()_+-={}|\\/.,<>';
  let hasSpecSymbol = false;

  if (!password || password.length < 8) {
    messages.push('Length of password must be > 7.');
  }

  if (password.toLowerCase() === password) {
    messages.push('Password must contain at least 1 letter in upper case');
  }

  for (const ch of password) {
    if (SPECIAL_SYMBOLS.includes(ch)) {
      hasSpecSymbol = true;

      break;
    }
  }

  if (!hasSpecSymbol) {
    messages.push('Password must contain at least 1 special symbol');
  }

  if (messages.length > 1) {
    throw new HttpException(messages.join('. '), 401);
  }
}
