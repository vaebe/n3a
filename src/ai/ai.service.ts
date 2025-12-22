import { Injectable } from '@nestjs/common';
import { agent } from './agent';

@Injectable()
export class AiService {
  async chat(id: string) {
    const messages = [{ role: 'user', content: '东京天气怎么样？' }];

    const runner = await agent;

    console.log(id);

    return runner.stream(
      { messages },
      {
        streamMode: 'updates',
        configurable: { thread_id: id || 'dev-thread' },
      },
    );
  }
}
