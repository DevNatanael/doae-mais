import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from './entities/member.entity';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  findAll(): Promise<Member[]> {
    return this.memberRepository.find({ order: { id: 'DESC' } });
  }

  async findOne(id: string): Promise<Member> {
    const member = await this.memberRepository.findOneBy({ id });
    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }
    return member;
  }

  async create(createMemberDto: CreateMemberDto): Promise<Member> {
    const member = this.memberRepository.create(createMemberDto);
    return this.memberRepository.save(member);
  }

  async update(id: string, updateMemberDto: UpdateMemberDto): Promise<Member> {
    const member = await this.memberRepository.findOneBy({ id });
    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }

    this.memberRepository.merge(member, updateMemberDto);
    return this.memberRepository.save(member);
  }

  async remove(id: string): Promise<void> {
    const result = await this.memberRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }
  }
}
