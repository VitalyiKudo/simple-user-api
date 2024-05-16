import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities';
import { FindOneOptions, Repository } from 'typeorm';
import { Position } from 'src/entities/position.entity';
import { UserRegistrationResponce } from 'src/types';

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
    let responce: UserRegistrationResponce = {
      success: false,
      message: ""
    }
    // Check if user exist
    const options: FindOneOptions<User> = {
      where: [{ name: dto.name }, { phone: dto.phone }],
    };
    const existingUser = await this.userRepository.findOne(options)
    // Find extisting position
    const position = await this.positionRepository.findOneBy(
      { id: positionId }
    )
    // Handle errors
    if (existingUser) {
      responce.message = "User with this phone or email already exist"
      return responce
    }
    if (!position) {
      responce.message = 'Position not found'
      return responce
    }

    const newUser = await this.userRepository.create({
      ...dto,
      position,
      positionName: position.name,
    })
    const user = await this.userRepository.save(newUser)

    if (user) {
      responce.success = true
      responce.user_id = user.id
      responce.message = "New user successfully registered"
    }

    return responce
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }
}
