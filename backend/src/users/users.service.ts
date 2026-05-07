import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 🔍 Buscar por email
  async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  // 📋 Buscar todos os usuários
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findBirthdaysToday() {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.birthDate IS NOT NULL')
      .andWhere(
        'EXTRACT(DAY FROM user.birthDate) = EXTRACT(DAY FROM CURRENT_DATE)',
      )
      .andWhere(
        'EXTRACT(MONTH FROM user.birthDate) = EXTRACT(MONTH FROM CURRENT_DATE)',
      )
      .getMany();
  }
}
