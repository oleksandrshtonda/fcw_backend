import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '@/user/dto/create-user.dto';
import { UserService } from '@/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from '@/user/dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  private generateToken(user: Omit<CreateUserDto, 'repeatPassword'>) {
    const payload = { email: user.email };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  private async validateUser(userDto: LoginUserDto) {
    const user = await this.userService.findOneByEmail(userDto.email);

    const passwordsEqual = await bcrypt.compare(
      userDto.password,
      user.password,
    );

    if (user && passwordsEqual) {
      return user;
    }

    throw new UnauthorizedException({ message: 'Incorrect email or password' });
  }

  async login(userDto: LoginUserDto) {
    const user = await this.validateUser(userDto);

    return this.generateToken(user);
  }

  async registration(userDto: CreateUserDto) {
    const candidate = await this.userService.findOneByEmail(userDto.email);

    if (candidate) {
      throw new HttpException('This user already exists', 409);
    }

    if (userDto.password !== userDto.repeatPassword) {
      throw new HttpException(
        'Bad request. user.password !== user.repeatPassword',
        401,
      );
    }

    const calculatedSalt = Math.trunc(Math.random() * 10);
    const randomSalt = calculatedSalt > 4 ? calculatedSalt : 5;
    const hashedPassword = await bcrypt.hash(userDto.password, randomSalt);
    const user = await this.userService.create({
      firstName: userDto.firstName,
      lastName: userDto.lastName,
      email: userDto.email,
      password: hashedPassword,
    });

    return this.generateToken(user);
  }
}
