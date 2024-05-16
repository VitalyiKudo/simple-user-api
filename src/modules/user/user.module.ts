import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Position, User } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([User, Position])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule { }
