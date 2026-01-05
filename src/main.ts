import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createWinstonLogger } from './plugins/winston';
import { setupSwagger } from './plugins/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: createWinstonLogger(),
    cors: true,
  });

  // Set global API prefix
  app.setGlobalPrefix('api');

  // Setup Swagger documentation
  setupSwagger(app);

  const PORT = process.env.PORT ?? 3000;
  await app.listen(PORT);

  console.log(`Application is running on: http://localhost:${PORT}`);
  console.log(`Swagger documentation: http://localhost:${PORT}/api/docs`);
}
void bootstrap();
