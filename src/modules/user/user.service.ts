import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities';
import { Repository } from 'typeorm';
import { Position } from 'src/entities/position.entity';
import { validate } from './errorHandler';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Position)
    private readonly positionRepository: Repository<Position>,
  ) { }

  async create(dto: CreateUserDto) {
    const { positionId } = dto

    const position = await this.positionRepository.findOneBy(
      { id: positionId }
    )

    await validate(dto, position)

    const newUser = await this.userRepository.create({
      ...dto,
      position,
      positionName: position.name,
    })
    const user = await this.userRepository.save(newUser)

    return {
      success: true,
      user_id: user.id,
      message: "New user successfully registered",
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

}
