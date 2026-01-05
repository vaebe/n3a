import { Controller, Post, Body, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ChatDto, ApiBodyExamples } from './dto/chat.dto';
import { toUIMessageStream } from '@ai-sdk/langchain';
import { pipeUIMessageStreamToResponse } from 'ai';
import { toBaseMessages } from '@ai-sdk/langchain';
import { agent } from './agent';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('AI')
@Controller('ai')
export class AiController {
  @Post()
  @ApiOperation({
    summary: 'AI 聊天接口',
    description: '使用 LangChain Agent 进行流式对话',
  })
  @ApiBody({
    type: ChatDto,
    description: 'AI 聊天请求',
    examples: ApiBodyExamples,
  })
  async chat(@Body() body: ChatDto, @Res() res: Response) {
    // 验证请求体
    if (!body || !body.id || !body.messages) {
      return res.status(400).json({
        error: 'Request body must contain "id" and "messages" fields',
      });
    }

    // 验证 agent 是否存在
    if (!agent) {
      return res.status(500).json({
        error: 'Agent is not initialized',
      });
    }

    const langchainMessages = await toBaseMessages(body.messages);

    const stream = await agent.stream(
      { messages: langchainMessages },
      {
        streamMode: ['values', 'messages'],
        configurable: { thread_id: body.id || 'dev-thread' },
      },
    );

    pipeUIMessageStreamToResponse({
      stream: toUIMessageStream(stream, {
        onStart: () => {
          console.log('开始输出！');
        },
        onFinal: () => {
          console.log('输出完成！');
        },
      }),
      response: res,
    });
  }
}
