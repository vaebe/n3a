import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AiModule } from './ai/ai.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        OPENAI_API_KEY: Joi.string().required(),
        LANGSMITH_TRACING: Joi.string().required(),
        LANGSMITH_ENDPOINT: Joi.string().required(),
        LANGSMITH_API_KEY: Joi.string().required(),
        LANGSMITH_PROJECT: Joi.string().required(),
        NODE_ENV: Joi.string()
          .valid('development', 'production')
          .default('development'),
      }),
      validationOptions: {
        allowUnknown: true, // 控制是否允许环境变量中未知的键
        abortEarly: true, // true，在遇到第一个错误时就停止验证；false，返回所有错误。默认为false。
      },
    }),
    AiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
