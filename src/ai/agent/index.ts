import { ChatOpenAI } from '@langchain/openai';
import { createAgent, createMiddleware, ToolMessage } from 'langchain';
import { getWeather } from './utils/tools';

// 自定义中间件：处理工具调用错误
const handleToolErrors = createMiddleware({
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

// 创建 AI 模型实例
const model = new ChatOpenAI({
  // 使用的模型
  model: 'z-ai/glm-4.5-air:free',
  // 从环境变量读取 API Key
  apiKey: process.env.OPENAI_API_KEY,
  configuration: {
    // 自定义 OpenAI 代理接口
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
      // 可选，用于在 openrouter.ai 上进行排名的网站 URL。
      'HTTP-Referer': 'https://blog.vaebe.cn/',
      // 可选，用于在 openrouter.ai 上排名的网站标题。
      'X-Title': 'n3a',
    },
  },
});

// 系统提示：告诉 AI 它的角色和可用工具
const systemPrompt = `
# 你是一个通用代理

# 你拥有的工具
getWeather: 获取天气情况
`;

// 创建 Agent
export const agent = createAgent({
  model,
  tools: [getWeather],
  middleware: [handleToolErrors],
  systemPrompt,
});
