import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiMessage } from '../generated/prisma/client';
import { UIMessage } from 'ai';

interface CreateAiMessageProps {
  message: UIMessage;
  chatId: string;
  userId: string;
}

@Injectable()
export class AiService {
  constructor(private prisma: PrismaService) {}

  createAiMessage(props: CreateAiMessageProps): Promise<AiMessage> {
    const { message, userId, chatId } = props;
    const { id, role, metadata, parts } = message;

    return this.prisma.aiMessage.create({
      data: {
        userId,
        id,
        conversationId: chatId,
        role,
        metadata: JSON.stringify(metadata),
        parts: JSON.stringify(parts),
      },
    });
  }
}
