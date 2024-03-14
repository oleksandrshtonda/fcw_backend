import { HttpException } from '@nestjs/common';

export function validateEmail(email: string) {
  if (!email || email.length < 5) {
    throw new HttpException(
      'Bad request. Length of user.email must be > 4',
      401,
    );
  }
}
