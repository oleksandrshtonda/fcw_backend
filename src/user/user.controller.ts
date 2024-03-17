import { Controller, Delete, Get, HttpCode, Param } from '@nestjs/common';
import { UserService } from '@/user/user.service';

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

  @Delete('/:id')
  @HttpCode(204)
  async delete(@Param('id') id: number) {
    return this.userService.remove(id);
  }
}
