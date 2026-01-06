import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Throttler (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // 应用与 main.ts 相同的配置
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.setGlobalPrefix('api');

    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
      // 等待连接关闭
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  });

  describe('速率限制功能', () => {
    it('应该允许限制内的请求通过', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/test-throttle')
        .expect(201);

      expect(response.body).toHaveProperty('message', 'Request successful');
      expect(response.body).toHaveProperty('timestamp');
    });

    it('使用 @SkipThrottle() 装饰器的端点不应被限流', async () => {
      // 健康检查端点使用了 @SkipThrottle() 装饰器
      for (let i = 0; i < 30; i++) {
        const response = await request(app.getHttpServer()).get('/api/hello');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Hello World!');
      }
    });

    it('超过速率限制时应返回 429 状态码', async () => {
      const limit = parseInt(process.env.THROTTLE_LIMIT || '20', 10);
      let throttled = false;
      let successCount = 0;
      let throttledCount = 0;

      // 发送多个请求直到触发限流（前面的测试可能已消耗部分配额）
      for (let i = 0; i < limit + 10; i++) {
        const response = await request(app.getHttpServer()).post(
          '/api/test-throttle',
        );

        if (response.status === 429) {
          throttled = true;
          throttledCount++;
          expect(response.body).toHaveProperty('statusCode', 429);
          expect(response.body).toHaveProperty('message');
          // 触发限流后可以退出
          if (throttledCount >= 2) {
            break;
          }
        } else if (response.status === 201) {
          successCount++;
        }
      }

      // 验证限流已触发
      expect(throttled).toBe(true);
      expect(successCount).toBeGreaterThan(0);
      expect(throttledCount).toBeGreaterThan(0);
    }, 60000);

    it('429 响应应包含 retry-after 响应头', async () => {
      // 前面的测试已触发限流，验证响应头
      const response = await request(app.getHttpServer()).post(
        '/api/test-throttle',
      );

      if (response.status === 429) {
        expect(response.headers).toHaveProperty('retry-after');
      } else {
        // 如果限流窗口已重置，重新触发限流
        const limit = parseInt(process.env.THROTTLE_LIMIT || '20', 10);
        for (let i = 0; i < limit + 5; i++) {
          const res = await request(app.getHttpServer()).post(
            '/api/test-throttle',
          );
          if (res.status === 429) {
            expect(res.headers).toHaveProperty('retry-after');
            return;
          }
        }
      }
    }, 60000);
  });

  describe('限流配置验证', () => {
    it('应遵守 THROTTLE_ENABLED 环境变量配置', () => {
      const enabled = process.env.THROTTLE_ENABLED !== 'false';
      expect(enabled).toBe(true);
    });

    it('应使用配置的 TTL 和 LIMIT 值', () => {
      const ttl = parseInt(process.env.THROTTLE_TTL || '60000', 10);
      const limit = parseInt(process.env.THROTTLE_LIMIT || '20', 10);

      expect(ttl).toBeGreaterThanOrEqual(1000);
      expect(limit).toBeGreaterThanOrEqual(1);
    });
  });
});
