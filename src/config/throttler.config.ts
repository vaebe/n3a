import { ConfigService } from '@nestjs/config';
import { ThrottlerModuleOptions, ThrottlerOptions } from '@nestjs/throttler';

export const getThrottlerConfig = (
  configService: ConfigService,
): ThrottlerModuleOptions => {
  const ttl = configService.get<number>('THROTTLE_TTL', 60000);
  const limit = configService.get<number>('THROTTLE_LIMIT', 20);
  const enabled = configService.get<boolean>('THROTTLE_ENABLED', true);

  const throttlers: ThrottlerOptions[] = [
    {
      ttl,
      limit,
    },
  ];

  return {
    throttlers,
    skipIf: () => !enabled,
  };
};

export const seconds = (count: number): number => count * 1000;
export const minutes = (count: number): number => count * 60 * 1000;
export const hours = (count: number): number => count * 60 * 60 * 1000;
export const days = (count: number): number => count * 24 * 60 * 60 * 1000;
