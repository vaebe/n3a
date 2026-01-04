import { Controller, Post, Body, Param } from '@nestjs/common';
import { AiService } from './ai.service';
import type { UIMessage } from 'ai';
import { toUIMessageStream } from '@ai-sdk/langchain';
import { createUIMessageStreamResponse } from 'ai';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post(':id')
  async chat(@Param('id') id: string, @Body() body: { messages: UIMessage[] }) {
    // 获取 LangChain agent 的流
    const langchainStream = await this.aiService.chat(id, body.messages);

    // 将 LangChain 流转换为 AI SDK 的 UI 消息流，并包装为标准响应
    return createUIMessageStreamResponse({
      stream: toUIMessageStream(langchainStream),
    });
  }
}
