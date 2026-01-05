import { Controller, Post, Body, Param } from '@nestjs/common';
import { AiService } from './ai.service';
import { toUIMessageStream } from '@ai-sdk/langchain';
import { createUIMessageStreamResponse } from 'ai';
import { ChatDto } from './dto/chat.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post(':id')
  async chat(@Param('id') id: string, @Body() body: ChatDto) {
    // 验证请求体
    if (!body || !body.messages) {
      throw new Error('Request body must contain "messages" array');
    }

    // 获取 LangChain agent 的流
    const langchainStream = await this.aiService.chat(id, body.messages);

    // 将 LangChain 流转换为 AI SDK 的 UI 消息流，并包装为标准响应
    return createUIMessageStreamResponse({
      stream: toUIMessageStream(langchainStream),
    });
  }
}
