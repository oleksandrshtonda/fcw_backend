import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/user/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '@/user/dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
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

    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
