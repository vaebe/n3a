import { Params } from 'nestjs-pino';
import { join } from 'path';
import type { IncomingMessage } from 'http';

const isProd = process.env.NODE_ENV === 'production';

export const pinoConfig: Params = {
  pinoHttp: isProd
    ? {
        level: 'info',

        // 生产环境使用 pino-roll transport 进行日志切割
        transport: {
          target: 'pino-roll',
          options: {
            file: join(process.cwd(), 'logs', 'app'),
            frequency: 'daily',
            size: '10m',
            mkdir: true,
            limit: {
              count: 14, // 保留 14 天
            },
          },
        },

        // 请求序列化
        serializers: {
          req(req: IncomingMessage & { id?: string }) {
            return {
              method: req.method,
              url: req.url,
              id: req.id,
            };
          },
        },

        // 自动生成请求 ID
        genReqId: (req) =>
          (req.headers['x-request-id'] as string) ?? crypto.randomUUID(),

        // 自动记录 HTTP 请求日志
        autoLogging: {
          ignore: (req) => {
            const ignorePaths = ['/health', '/api/docs', '/api/docs-json'];
            return ignorePaths.includes(req.url || '');
          },
        },

        // 自定义日志格式
        formatters: {
          level: (label) => {
            return { level: label };
          },
        },
      }
    : {
        level: 'debug',

        // 开发环境使用 pino-pretty 美化输出
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'yyyy-mm-dd HH:MM:ss',
            ignore: 'pid,hostname',
            singleLine: false,
          },
        },

        // 请求序列化
        serializers: {
          req(req: IncomingMessage & { id?: string }) {
            return {
              method: req.method,
              url: req.url,
              id: req.id,
            };
          },
        },

        // 自动生成请求 ID
        genReqId: (req) =>
          (req.headers['x-request-id'] as string) ?? crypto.randomUUID(),

        // 自动记录 HTTP 请求日志
        autoLogging: {
          ignore: (req) => {
            const ignorePaths = ['/health', '/api/docs', '/api/docs-json'];
            return ignorePaths.includes(req.url || '');
          },
        },

        // 自定义日志格式
        formatters: {
          level: (label) => {
            return { level: label };
          },
        },
      },
};
