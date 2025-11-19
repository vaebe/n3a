import { Injectable } from '@nestjs/common';
import { agent } from './agent';

@Injectable()
export class AiService {
  async chat(id: string) {
    const messages = [{ role: 'user', content: '东京天气怎么样？' }];

    console.log(id);

    return await agent.stream({ messages }, { streamMode: 'updates' });
  }
}
