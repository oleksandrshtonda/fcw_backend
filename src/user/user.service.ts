import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '@/user/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '@/user/dto/create-user.dto';
import { LoginUserDto } from '@/user/dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOneById(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  async create(user: CreateUserDto): Promise<User> {
    const userExists = await this.findOneByEmail(user.email);

    if (userExists) {
      throw new HttpException('This user already exists', 409);
    }

    if (user.password !== user.repeatPassword) {
      throw new HttpException(
        'Bad request. user.password !== user.repeatPassword',
        401,
      );
    }

    const calculatedSalt = Math.trunc(Math.random() * 10);
    const randomSalt = calculatedSalt > 4 ? calculatedSalt : 5;
    const userDataForCreation = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: await bcrypt.hash(user.password, randomSalt),
    };

    const newUser = this.userRepository.create(userDataForCreation);
    return this.userRepository.save(newUser);
  }

  async login(user: LoginUserDto) {
    const userExists = await this.findOneByEmail(user.email);

    if (userExists === null) {
      throw new HttpException('The user with this email does not exist', 409);
    }

    const passwordIsCorrect = await bcrypt.compare(
      user.password,
      userExists.password,
    );

    if (!passwordIsCorrect) {
      throw new UnauthorizedException();
    }

    return userExists;
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
