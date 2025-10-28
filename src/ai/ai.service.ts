import { Injectable } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';
import { createAgent, tool } from 'langchain';
import * as z from 'zod';

const getWeather = tool((input) => `It's always sunny in ${input.city}!`, {
  name: 'get_weather',
  description: 'Get the weather for a given city',
  schema: z.object({
    city: z.string().describe('The city to get the weather for'),
  }),
});

@Injectable()
export class AiService {
  async chat(id: string) {
    const model = new ChatOpenAI({
      model: 'deepseek-v3.2',
      apiKey: process.env.OPENAI_API_KEY,
      configuration: {
        baseURL: 'https://apis.iflow.cn/v1',
      },
      temperature: 1.3,
    });

    const agent = createAgent({
      model,
      tools: [getWeather],
    });

    console.log(id);

    const msg = await agent.invoke({
      messages: [{ role: 'user', content: "What's the weather in Tokyo?" }],
    });

    return msg;
  }
}
