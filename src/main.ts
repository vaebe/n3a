import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { setupSwagger } from './plugins/swagger';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    cors: true,
  });

  app.useLogger(app.get(Logger));

  // Enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Set global API prefix
  app.setGlobalPrefix('api');

  // Setup Swagger documentation
  setupSwagger(app);

  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  const PORT = process.env.PORT ?? 3000;
  await app.listen(PORT);

  const logger = app.get(Logger);
  logger.log(`Application is running on: http://localhost:${PORT}`);
  logger.log(`Swagger documentation: http://localhost:${PORT}/api/docs`);
}
void bootstrap();
