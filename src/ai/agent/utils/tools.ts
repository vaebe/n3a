import { tool } from 'langchain';
import * as z from 'zod';

// 定义一个天气工具
// 输入一个地区，总是返回该地区阳光明媚
export const getWeather = tool(
  (input) => `It's always sunny in ${input.city}!`,
  {
    name: 'get_weather',
    description: 'Get the weather for a given city',
    schema: z.object({
      city: z.string().describe('The city to get the weather for'),
    }),
  },
);
