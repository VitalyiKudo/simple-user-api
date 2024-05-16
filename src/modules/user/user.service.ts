import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities';
import { Repository } from 'typeorm';
import { Position } from 'src/entities/position.entity';
import { validateCreationErrors, validateFindAllErrors, validateFindOneErrors } from './errorHandler';
import { paginate } from 'src/utils';
import { ConfigService } from '@nestjs/config';
import { PaginationLinks } from 'src/types';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Position)
    private readonly positionRepository: Repository<Position>,
    private readonly config: ConfigService,
  ) { }

  async create(dto: CreateUserDto) {
    const { positionId } = dto

    const position = await this.positionRepository.findOneBy(
      { id: positionId }
    )

    // await validate(dto, position)

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

  async findAll(pagination?: { count: number; page: number }) {
    const { count, page } = pagination
    const users = await this.userRepository.find()
    const serverUrl = this.config.get('SERVER_URL')
    const totalPages = Math.ceil(users.length / count)

    const links: PaginationLinks = {
      next_url: `${serverUrl}/users?page=${Number(page) + 1}&count=${count}`,
      prev_url: null
    }
    if (page > 1)
      links.prev_url = `${serverUrl}/users?page=${Number(page) - 1}&count=${count}`

    await validateFindAllErrors(page, count, totalPages)

    return {
      success: true,
      page,
      total_pages: totalPages,
      total_users: users.length,
      count,
      links,
      users: paginate(users, count, page)
    }
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id: !isNaN(Number(id)) ? id : 0 })

    await validateFindOneErrors(id, user)

    return {
      success: true,
      user,
    }
  }
}
