import { Injectable, ExecutionContext, Logger } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerException } from '@nestjs/throttler';
import { Request } from 'express';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  private readonly logger = new Logger(CustomThrottlerGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const ip = request.ip || request.socket.remoteAddress || 'unknown';
    const route = request.url;

    try {
      const result = await super.canActivate(context);
      this.logger.debug(`Rate limit check passed for IP ${ip} on ${route}`);
      return result;
    } catch (error) {
      if (error instanceof ThrottlerException) {
        this.logger.warn(`Rate limit exceeded for IP ${ip} on ${route}`);
      }
      throw error;
    }
  }
}
