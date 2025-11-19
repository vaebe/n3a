import { ChatOpenAI } from '@langchain/openai';
import { createAgent, tool, createMiddleware, ToolMessage } from 'langchain';
import * as z from 'zod';

const getWeather = tool((input) => `It's always sunny in ${input.city}!`, {
  name: 'get_weather',
  description: 'Get the weather for a given city',
  schema: z.object({
    city: z.string().describe('The city to get the weather for'),
  }),
});

const handleToolErrors = createMiddleware({
  name: 'HandleToolErrors',
  wrapToolCall: (request, handler) => {
    try {
      return handler(request);
    } catch (error) {
      // Return a custom error message to the model
      return new ToolMessage({
        content: `工具错误：请检查您的输入并重试。 (${error})`,
        tool_call_id: request.toolCall.id!,
      });
    }
  },
});

const model = new ChatOpenAI({
  model: 'z-ai/glm-4.5-air:free',
  apiKey: process.env.OPENAI_API_KEY,
  configuration: {
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
      'HTTP-Referer': 'https://blog.vaebe.cn/', // Optional. Site URL for rankings on openrouter.ai.
      'X-Title': 'n3a', // Optional. Site title for rankings on openrouter.ai.
    },
  },
});

const systemPrompt = `
# 你是一个通用代理

# 你拥有的工具
getWeather: 获取天气情况
`;

export const agent = createAgent({
  model,
  tools: [getWeather],
  middleware: [handleToolErrors],
  systemPrompt,
});
