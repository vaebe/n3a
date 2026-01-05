import { tool, createMiddleware, ToolMessage } from 'langchain';
import * as z from 'zod';

// 自定义中间件：处理工具调用错误
export const handleToolErrors = createMiddleware({
  name: 'HandleToolErrors',
  // wrapToolCall 在工具被调用时包裹处理逻辑
  wrapToolCall: (request, handler) => {
    try {
      // 正常调用工具
      return handler(request);
    } catch (error) {
      // 如果工具调用出错，返回自定义错误消息给模型
      return new ToolMessage({
        content: `工具错误：请检查您的输入并重试。 (${error})`,
        tool_call_id: request.toolCall.id!,
      });
    }
  },
});

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
