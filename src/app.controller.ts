import { Controller, Get, Post } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { AppService } from './app.service';

@ApiExcludeController()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @SkipThrottle()
  @Get('/hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('test-throttle')
  testThrottle(): { message: string; timestamp: number } {
    return {
      message: 'Request successful',
      timestamp: Date.now(),
    };
  }
}
