import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import entities, { Position, User } from './entities';
import { UserModule } from './modules';
import { ImageSeedService } from './image-seed.service';
import { BootsTrapService } from './bootstrap.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get("DB_URL"),
        synchronize: true,
        ssl: {
          rejectUnauthorized: false,
        },
        entities,
        autoLoadEntities: true,
        keepConnectionAlive: true,
        dropSchema: false,
        createSchema: true,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    TypeOrmModule.forFeature([User, Position])
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ImageSeedService,
    BootsTrapService,
  ],
})
export class AppModule { }
