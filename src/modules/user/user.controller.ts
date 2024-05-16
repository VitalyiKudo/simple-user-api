import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';


@Controller('')
export class UserController {
  constructor(private readonly userService: UserService) { }
  // Create
  @Post('users')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  // Read
  @Get('users')
  findAll(
    @Request() req,
  ) {
    return this.userService.findAll({
      count: req.query.count ? req.query.count : 5,
      page: req.query.page ? req.query.page : 0,
    });
  }
  @Get('users/:id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }
  @Get('positions')
  findAllPositions() {
    return this.userService.findAllUserPositions()
  }
}
