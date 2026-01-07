import type { UIMessage } from 'ai';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsObject } from 'class-validator';

export class ChatDto {
  @ApiProperty({
    description: '线程 ID，用于持久化对话历史',
    example: 'thread-123',
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'AI SDK UIMessage 格式的单条消息',
    example: {
      id: 'msg-1',
      role: 'user',
      parts: [
        {
          type: 'text',
          text: '你好',
        },
      ],
    },
  })
  @IsObject()
  @IsNotEmpty()
  message: UIMessage;
}

export const ApiBodyExamples = {
  简单对话: {
    value: {
      id: 'thread-123',
      message: {
        id: 'msg-1',
        role: 'user',
        parts: [
          {
            type: 'text',
            text: '你好，请介绍一下自己',
          },
        ],
      },
    },
  },
  查询天气: {
    value: {
      id: 'thread-456',
      message: {
        id: 'msg-2',
        role: 'user',
        parts: [
          {
            type: 'text',
            text: '今天北京的天气怎么样？',
          },
        ],
      },
    },
  },
};
