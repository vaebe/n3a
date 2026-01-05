import type { UIMessage } from 'ai';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray } from 'class-validator';

export class ChatDto {
  @ApiProperty({
    description: '线程 ID，用于持久化对话历史',
    example: 'thread-123',
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'AI SDK UIMessage 格式的消息数组',
    example: [
      {
        id: 'msg-1',
        role: 'user',
        parts: [
          {
            type: 'text',
            text: '你好',
          },
        ],
      },
    ],
  })
  @IsArray()
  @IsNotEmpty()
  messages: UIMessage[];
}

export const ApiBodyExamples = {
  简单对话: {
    value: {
      id: 'thread-123',
      messages: [
        {
          id: 'msg-1',
          role: 'user',
          parts: [
            {
              type: 'text',
              text: '你好，请介绍一下自己',
            },
          ],
        },
      ],
    },
  },
  多轮对话: {
    value: {
      id: 'thread-456',
      messages: [
        {
          id: 'msg-1',
          role: 'user',
          parts: [
            {
              type: 'text',
              text: '今天北京的天气怎么样？',
            },
          ],
        },
        {
          id: 'msg-2',
          role: 'assistant',
          parts: [
            {
              type: 'text',
              text: '我可以帮你查询北京的天气。',
            },
          ],
        },
        {
          id: 'msg-3',
          role: 'user',
          parts: [
            {
              type: 'text',
              text: '好的，请查询',
            },
          ],
        },
      ],
    },
  },
};
