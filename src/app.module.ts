import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AiModule } from './ai/ai.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { pinoConfig } from './plugins/pino.config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),

        PORT: Joi.number().default(3000),
        OPENAI_API_KEY: Joi.string().required(),

        // LangSmith configuration
        LANGSMITH_TRACING: Joi.string().optional(),
        LANGSMITH_ENDPOINT: Joi.string().optional(),
        LANGSMITH_API_KEY: Joi.string().optional(),
        LANGSMITH_PROJECT: Joi.string().optional(),

        // Database configuration
        NEON_PG_DB: Joi.string().required(),
      }),
      validationOptions: {
        allowUnknown: true, // 控制是否允许环境变量中未知的键
        abortEarly: true, // true，在遇到第一个错误时就停止验证；false，返回所有错误。默认为false。
      },
    }),
    LoggerModule.forRoot(pinoConfig),
    AiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
