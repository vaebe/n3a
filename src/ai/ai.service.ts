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

  async ensureConversation(
    chatId: string,
    userId: string,
    name?: string,
  ): Promise<void> {
    await this.prisma.aiConversation.upsert({
      where: { id: chatId },
      update: {},
      create: {
        id: chatId,
        userId,
        name: name || 'New Conversation',
      },
    });
  }

  async getHistoryMessages(
    chatId: string,
    userId: string,
  ): Promise<UIMessage[]> {
    const messages = await this.prisma.aiMessage.findMany({
      where: {
        conversationId: chatId,
        userId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return messages.map((msg) => this.aiMessageToUIMessage(msg));
  }

  createAiMessage(props: CreateAiMessageProps): Promise<AiMessage> {
    const { message, userId, chatId } = props;
    const { id, role, metadata, parts } = message;

    return this.prisma.aiMessage.upsert({
      where: { id },
      update: {
        role,
        metadata: JSON.stringify(metadata),
        parts: JSON.stringify(parts),
      },
      create: {
        userId,
        id,
        conversationId: chatId,
        role,
        metadata: JSON.stringify(metadata),
        parts: JSON.stringify(parts),
      },
    });
  }

  private aiMessageToUIMessage(aiMessage: AiMessage): UIMessage {
    return {
      id: aiMessage.id,
      role: aiMessage.role as 'user' | 'assistant' | 'system',
      metadata: aiMessage.metadata
        ? (JSON.parse(aiMessage.metadata) as Record<string, unknown>)
        : undefined,
      parts: JSON.parse(aiMessage.parts) as UIMessage['parts'],
    };
  }
}
