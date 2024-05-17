import { JwtService } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Position, User } from 'src/entities';
import { JwtManager } from './jwt.service';
import { AuthenticationStrategy } from 'src/common/strategies';
import { CompressService } from './compress-image.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Position])],
  controllers: [UserController],
  providers: [
    UserService,
    JwtService,
    CompressService,
    JwtManager,
    AuthenticationStrategy
  ],
})
export class UserModule { }
