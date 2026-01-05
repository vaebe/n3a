import { Params } from 'nestjs-pino';
import { join } from 'path';
import type { IncomingMessage } from 'http';

const isProd = process.env.NODE_ENV === 'production';

const commonConfig = {
  // 自动生成请求 ID
  genReqId: (req: IncomingMessage) =>
    (req.headers['x-request-id'] as string) ?? crypto.randomUUID(),

  // 自动记录 HTTP 请求日志
  autoLogging: {
    ignore: (req: IncomingMessage) => {
      const ignorePaths = ['/health', '/api/docs', '/api/docs-json'];
      return ignorePaths.includes(req.url || '');
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
};

// 生产环境使用 pino-roll 进行日志切割
const proTransport = {
  target: 'pino-roll',
  options: {
    file: join(process.cwd(), 'logs', 'app'),
    frequency: 'daily',
    size: '5m',
    mkdir: true,
    limit: {
      count: 14, // 保留 14 天
    },
  },
};

const devtTransport = {
  // 开发环境使用 pino-pretty 美化输出
  target: 'pino-pretty',
  options: {
    colorize: true,
    translateTime: 'yyyy-mm-dd HH:MM:ss',
    singleLine: false,
    ignore: 'pid,hostname',
  },
};

export const pinoConfig: Params = {
  pinoHttp: {
    ...commonConfig,
    useLevel: isProd ? 'info' : 'debug',
    // 根据环境选择不同的 transport
    transport: isProd ? proTransport : devtTransport,
  },
};
