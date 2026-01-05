import { Controller, Post, Body, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ChatDto } from './dto/chat.dto';
import { toUIMessageStream } from '@ai-sdk/langchain';
import { pipeUIMessageStreamToResponse } from 'ai';
import { toBaseMessages } from '@ai-sdk/langchain';
import { agent } from './agent';

@Controller('ai')
export class AiController {
  @Post()
  async chat(@Body() body: ChatDto, @Res() res: Response) {
    // 验证请求体
    if (!body || !body.id || !body.messages) {
      return res.status(400).json({
        error: 'Request body must contain "id" and "messages" fields',
      });
    }

    try {
      console.log('Thread ID:', body.id);
      console.log('Messages:', body.messages);

      // 将 AI SDK 的 UIMessage 转换为 LangChain 的 BaseMessage 格式
      const langchainMessages = await toBaseMessages(body.messages);

      // 调用 LangChain agent 获取流
      const langchainStream = await agent?.stream(
        { messages: langchainMessages },
        {
          streamMode: 'messages',
          configurable: { thread_id: body.id || 'dev-thread' },
        },
      );

      // 使用 AI SDK 官方方法处理响应
      pipeUIMessageStreamToResponse({
        response: res,
        stream: toUIMessageStream(langchainStream),
      });
    } catch (error) {
      console.error('Chat error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}
