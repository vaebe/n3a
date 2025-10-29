import { Injectable } from '@nestjs/common';
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
  model: 'deepseek-v3.2',
  apiKey: process.env.OPENAI_API_KEY,
  configuration: {
    baseURL: 'https://apis.iflow.cn/v1',
  },
  temperature: 1.3,
});

const systemPrompt = `
# 你是一个通用代理

# 你拥有的工具

getWeather: 获取天气情况

`;

@Injectable()
export class AiService {
  async chat(id: string) {
    const agent = createAgent({
      model,
      tools: [getWeather],
      middleware: [handleToolErrors],
      systemPrompt,
    });

    const messages = [{ role: 'user', content: '东京天气怎么样？' }];

    console.log(id);

    // for await (const chunk of await agent.stream(
    //   { messages },
    //   { streamMode: 'updates' },
    // )) {
    //   const [step, content] = Object.entries(chunk)[0];
    //   console.log(`step: ${step}`);
    //   console.log(`content: ${JSON.stringify(content, null, 2)}`);
    // }

    const msg = await agent.invoke({ messages });

    return msg;
  }
}
