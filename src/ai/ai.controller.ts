import { Controller } from '@nestjs/common';
import { Get, Param } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get(':id')
  chat(@Param('id') id: string) {
    return this.aiService.chat(id);
  }
}
