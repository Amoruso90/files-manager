import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { AppService } from './app.service';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { FilesModule } from './api/files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      // validationSchema: Joi.object({
      //   APP_URL: Joi.string().required(),
      //   ECOMMERCE_PROVIDER: Joi.string().required(),
      //   APP_APIKEY: Joi.string().required(),
      // }),
      isGlobal: true,
    }),
    RedisModule.forRoot({
      config: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.BACKEND_REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
      },
    }),
    FilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
