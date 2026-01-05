import { Controller, Post, Body, Res, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { ChatDto, ApiBodyExamples } from './dto/chat.dto';
import { toUIMessageStream } from '@ai-sdk/langchain';
import { pipeUIMessageStreamToResponse } from 'ai';
import { toBaseMessages } from '@ai-sdk/langchain';
import { createAgent } from 'langchain';
import { getWeather, handleToolErrors } from './agent/utils/tools';
import { openrouterModel } from './agent/models/openrouter';
import { PostgresSaver } from '@langchain/langgraph-checkpoint-postgres';
import { systemPrompt } from './agent/prompts';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('AI')
@Controller('ai')
export class AiController implements OnModuleInit {
  private checkpointer: PostgresSaver;
  private agent: ReturnType<typeof createAgent>;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    // 初始化 checkpointer
    const neonPgDb = this.configService.get<string>('NEON_PG_DB', '');
    this.checkpointer = PostgresSaver.fromConnString(neonPgDb);

    try {
      await this.checkpointer.setup();
      console.log('Checkpointer setup successfully');
    } catch (e) {
      console.error('Checkpointer setup error', e);
    }

    // 初始化 agent
    this.agent = createAgent({
      model: openrouterModel,
      tools: [getWeather],
      middleware: [handleToolErrors],
      systemPrompt,
      checkpointer: this.checkpointer,
    });

    console.log('Agent initialized successfully');
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
    const langchainMessages = await toBaseMessages(body.messages);

    const stream = await this.agent.stream(
      { messages: langchainMessages },
      {
        streamMode: ['values', 'messages'],
        configurable: { thread_id: body.id },
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
