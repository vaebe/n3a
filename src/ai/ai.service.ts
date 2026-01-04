import { Injectable } from '@nestjs/common';
import { agent } from './agent';
import { toBaseMessages } from '@ai-sdk/langchain';
import type { UIMessage } from 'ai';

@Injectable()
export class AiService {
  async chat(id: string, messages: UIMessage[]) {
    console.log('Thread ID:', id);
    console.log('Messages:', messages);

    // 将 AI SDK 的 UIMessage 转换为 LangChain 的 BaseMessage 格式
    const langchainMessages = await toBaseMessages(messages);

    return agent.stream(
      { messages: langchainMessages },
      {
        streamMode: 'messages',
        configurable: { thread_id: id || 'dev-thread' },
      },
    );
  }
}
