import { Controller } from '@nestjs/common';
import { Get, Param, Res } from '@nestjs/common';
import { AiService } from './ai.service';
import type { Response } from 'express';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get(':id')
  async chat(@Param('id') id: string, @Res() res: Response) {
    // 设置 SSE 头
    res.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    });

    const iterator = (await this.aiService.chat(id)) as AsyncIterable<
      Record<string, unknown>
    >;

    try {
      for await (const chunk of iterator) {
        const entries = Object.entries(chunk);

        if (entries.length === 0) {
          continue;
        }

        const [step, content] = entries[0];
        const payload = { step, content };
        res.write(`data: ${JSON.stringify(payload)}\n\n`);
      }

      res.write('event: done\ndata: {}\n\n');
    } catch (err) {
      res.write(
        'event: error\ndata: ' +
          JSON.stringify({ error: String(err) }) +
          '\n\n',
      );
    } finally {
      res.end();
    }
  }
}
