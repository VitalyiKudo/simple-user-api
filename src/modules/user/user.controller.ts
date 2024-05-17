import { Controller, Get, Post, Body, Param, Request, UseInterceptors, UploadedFile, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { createDiskStorage } from 'src/utils';
import { uploadPath } from 'src/utils/constants';
import { JwtManager } from './jwt.service';
import { AuthenticationGuard } from 'src/common/guards';
import { TinityService } from './titify-image.service';

const avatarStorage = createDiskStorage(uploadPath)

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtManager: JwtManager,
  ) { }
  // Create
  @Post('users')
  @UseGuards(AuthenticationGuard)
  @UseInterceptors(FileInterceptor('photo', avatarStorage))
  async create(
    @Body() dto: CreateUserDto,
    @UploadedFile() photo: Express.Multer.File
  ) {
    return this.userService.create(dto, photo?.filename);
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
  @Get('avatars/:filename')
  getAttachments(@Param('filename') imagename, @Res() res) {
    return res.sendFile(`${process.cwd()}/uploads/avatars/${imagename}`);
  }
  @Get('/token')
  createAuthToken() {
    return this.jwtManager.createAuthToken()
  }
}
