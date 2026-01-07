import {
  Controller,
  Post,
  Body,
  Res,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { ChatDto, ApiBodyExamples } from './dto/chat.dto';
import { toUIMessageStream } from '@ai-sdk/langchain';
import { pipeUIMessageStreamToResponse } from 'ai';
import { toBaseMessages } from '@ai-sdk/langchain';
import { createAgent } from 'langchain';
import { getWeather, handleToolErrors } from './agent/utils/tools';
import { initModel } from './agent/models';
import { PostgresSaver } from '@langchain/langgraph-checkpoint-postgres';
import { systemPrompt } from './agent/prompts';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { AiService } from './ai.service';
import type { UIMessage } from 'ai';

@ApiTags('AI')
@Controller('ai')
export class AiController implements OnModuleInit {
  private readonly logger = new Logger(AiController.name);
  private checkpointer: PostgresSaver;
  private agent: ReturnType<typeof createAgent>;

  constructor(
    private readonly configService: ConfigService,
    private readonly aiService: AiService,
  ) {}

  async onModuleInit() {
    // 初始化 checkpointer
    const LANGCHAIN_DB = this.configService.get<string>('LANGCHAIN_DB', '');
    this.checkpointer = PostgresSaver.fromConnString(LANGCHAIN_DB);

    try {
      await this.checkpointer.setup();
      this.logger.log('Checkpointer setup successfully');
    } catch (e) {
      this.logger.error('Checkpointer setup error', e);
    }

    const model = initModel('ollama');

    // 初始化 agent
    this.agent = createAgent({
      model,
      tools: [getWeather],
      middleware: [handleToolErrors],
      systemPrompt,
      checkpointer: this.checkpointer,
    });

    this.logger.log('Agent initialized successfully');
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
    const userId = 'admin';
    const chatId = body.id;

    // 确保对话存在
    await this.aiService.ensureConversation(chatId, userId);

    // 获取历史消息
    const historyMessages = await this.aiService.getHistoryMessages(
      chatId,
      userId,
    );

    // 保存新的用户消息
    await this.aiService.createAiMessage({
      message: body.message,
      chatId,
      userId,
    });

    // 合并历史消息和新消息
    const allMessages = [...historyMessages, body.message];

    const langchainMessages = await toBaseMessages(allMessages);

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
          this.logger.log('开始输出！');
        },
        onFinal: async (message) => {
          this.logger.log('输出完成！');

          // 保存 AI 响应消息
          try {
            const assistantMessage: UIMessage = {
              id: `msg-${Date.now()}`,
              role: 'assistant',
              parts: [
                {
                  type: 'text',
                  text:
                    typeof message === 'string'
                      ? message
                      : JSON.stringify(message),
                },
              ],
            };

            await this.aiService.createAiMessage({
              message: assistantMessage,
              chatId,
              userId,
            });
            this.logger.log(`AI 消息已保存: ${assistantMessage.id}`);
          } catch (error) {
            this.logger.error('保存 AI 消息失败', error);
          }
        },
      }),
      response: res,
    });
  }
}
