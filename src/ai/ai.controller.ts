import { Controller, Post, Body, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ChatDto, ApiBodyExamples } from './dto/chat.dto';
import { toUIMessageStream } from '@ai-sdk/langchain';
import { pipeUIMessageStreamToResponse, pipeTextStreamToResponse } from 'ai';
import { toBaseMessages } from '@ai-sdk/langchain';
import { agent } from './agent';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('AI')
@Controller('ai')
export class AiController {
  /**
   * 发送错误流响应
   * @param res Express Response 对象
   * @param errorMessage 错误信息
   * @param statusCode HTTP 状态码
   */
  private sendErrorStream(
    res: Response,
    errorMessage: string,
    statusCode: number,
  ) {
    // 创建一个包含错误消息的 ReadableStream
    const errorStream = new ReadableStream<string>({
      start(controller) {
        controller.enqueue(errorMessage);
        controller.close();
      },
    });

    // 使用 AI SDK 的流式响应方法
    pipeTextStreamToResponse({
      response: res,
      status: statusCode,
      textStream: errorStream,
    });
  }

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
      return this.sendErrorStream(
        res,
        'Request body must contain "id" and "messages" fields',
        400,
      );
    }

    // 验证 agent 是否存在
    if (!agent) {
      return this.sendErrorStream(res, 'Agent is not initialized', 500);
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
