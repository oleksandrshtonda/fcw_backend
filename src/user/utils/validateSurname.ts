import { HttpException } from '@nestjs/common';

export function validateSurname(surname: string) {
  if (!surname || surname.length < 2 || surname.length > 64) {
    throw new HttpException(
      'Bad request. Length of user.surname must be > 1 and < 65',
      401,
    );
  }
}
