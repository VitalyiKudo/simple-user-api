import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ImageSeedService } from './image-seed.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly seed: ImageSeedService,
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // @Post('/test')
  // async random() {
  //   await this.seed.fetchRandomImage()
  // }
}
