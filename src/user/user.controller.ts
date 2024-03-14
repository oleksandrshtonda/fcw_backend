import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from '@/user/user.service';
import { validateName } from '@/user/utils/validateName';
import { validateSurname } from '@/user/utils/validateSurname';
import { validateEmail } from '@/user/utils/validateEmail';
import { validatePassword } from '@/user/utils/validatePassword';
// import { LoginUserDto } from '@/user/dto/login-user.dto';

@Controller('/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getAllUsers() {
    return this.userService.findAll();
  }

  @Get('/:id')
  async getById(@Param('id') id: number) {
    return this.userService.findOneById(id);
  }

  @Post()
  @HttpCode(201)
  async registration(@Body() createUserData: CreateUserDto) {
    validateName(createUserData.firstName);
    validateSurname(createUserData.lastName);
    validateEmail(createUserData.email);
    validatePassword(createUserData.password);
    validatePassword(createUserData.repeatPassword);

    if (createUserData.password !== createUserData.repeatPassword) {
      throw new HttpException(
        'Bad request. user.password != user.repeatRepeat',
        401,
      );
    }

    const createdUser = await this.userService.create(createUserData);

    return createdUser;
  }

  // @Post()
  // async login(@Body() authUserData: LoginUserDto) {
  //   validateEmail(authUserData.email);
  //   validatePassword(authUserData.password);
  // }

  @Patch('/:id')
  async update(@Body() updateUserData: object, @Param('id') id: number) {}

  @Delete('/:id')
  @HttpCode(204)
  async delete(@Param('id') id: number) {
    return this.userService.remove(id);
  }
}
