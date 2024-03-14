import { HttpException } from '@nestjs/common';

export function validateName(name: string) {
  if (!name || name.length < 2 || name.length > 64) {
    throw new HttpException(
      'Bad request. Length of user.name must be > 1 and < 65',
      401,
    );
  }
}
