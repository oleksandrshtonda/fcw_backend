import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('/users')
export class UserController {
  @Get()
  async getAllUsers() {}

  @Get('/:id')
  async getById(@Param() params) {}

  @Post()
  @HttpCode(201)
  async registration(@Body() createUserData: CreateUserDto) {}

  @Post()
  async login(@Body() authUserData: object) {}

  @Patch('/:id')
  async update(@Body() updateUserData: object, @Param() params) {}

  @Delete('/:id')
  @HttpCode(204)
  async delete(@Param() params) {}
}
