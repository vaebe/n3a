import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('N3A API')
    .setDescription('N3A API Documentation - AI Agent Service')
    .setVersion('1.0')
    .addServer('http://localhost:3000', 'Local Development')
    .addServer('https://api.n3a.dev', 'Production')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      defaultModelsExpandDepth: -1, // 隐藏 Schemas 部分
      docExpansion: 'none', // 默认折叠所有接口
      filter: true, // 启用搜索过滤
      showRequestDuration: true, // 显示请求耗时
    },
  });
}
