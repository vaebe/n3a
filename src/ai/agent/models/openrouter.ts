import { ChatOpenAI } from '@langchain/openai';

// 创建 AI 模型实例
export const openrouterModel = new ChatOpenAI({
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
