import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResetEntity } from './reset.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ResetService {
  constructor(
    @InjectRepository(ResetEntity)
    private readonly resetRepository: Repository<ResetEntity>,
  ) {}

  async create(reset: Partial<ResetEntity>): Promise<ResetEntity> {
    return await this.resetRepository.save(reset);
  }

  async findOne(condition: any): Promise<ResetEntity | null> {
    return this.resetRepository.findOne({ where: condition });
  }
}
