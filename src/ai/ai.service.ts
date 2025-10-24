import { Injectable } from '@nestjs/common';

@Injectable()
export class AiService {
  chat(id: string) {
    return `这是一个 ai chat ${id}`;
  }
}
