import { HttpException } from '@nestjs/common';

export function validatePassword(password: string) {
  if (!password || password.length < 8) {
    throw new HttpException(
      'Bad request. Length of user.password must be > 7',
      401,
    );
  }
}
