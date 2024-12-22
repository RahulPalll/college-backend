import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from './roles.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // Signup method
  async signup(
    username: string,
    password: string,
  ): Promise<{ message: string }> {
    const userExists = await this.userRepository.findOne({
      where: { username },
    });

    if (userExists) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      username,
      password: hashedPassword,
      roles: [Role.User],
    });

    await this.userRepository.save(user);

    return { message: 'User created successfully' };
  }

  async addRole(username: string, role: Role): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) {
      throw new Error('User not found');
    }

    if (!user.roles.includes(role)) {
      user.roles.push(role); // Add the role
      await this.userRepository.save(user);
    }

    return { message: `Role ${role} added to user ${username}` };
  }

  // Login method
  async login(
    username: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      username: user.username,
      sub: user.id,
      roles: user.roles,
    };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}
