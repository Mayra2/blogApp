import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './models/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(user: UserEntity) {
    return await this.userRepository.save(user);
  }

  async findOneBy(condition: any): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: condition }); // Ensure valid condition
  }

  async update(id: number, data: Partial<UserEntity>): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, data); // Update the user entity with new data
    return await this.userRepository.save(user); // Save and return the updated entity
  }
}
