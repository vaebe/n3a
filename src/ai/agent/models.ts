import { ChatOpenAI } from '@langchain/openai';
import { ChatOllama } from '@langchain/ollama';

const modelFactoryMap = {
  ollama: () =>
    new ChatOllama({
      model: 'deepseek-v3.2:cloud',
      baseUrl: 'https://ollama.com',
      headers: {
        Authorization: `Bearer ${process.env.OLLAMA_API_KEY}`,
      },
    }),

  openrouter: () =>
    new ChatOpenAI({
      model: 'qwen/qwen3-coder:free',
      apiKey: process.env.OPENAI_API_KEY,
      configuration: {
        baseURL: 'https://openrouter.ai/api/v1',
        defaultHeaders: {
          'HTTP-Referer': 'https://blog.vaebe.cn/',
          'X-Title': 'n3a',
        },
      },
    }),
} as const;

export type ModelType = keyof typeof modelFactoryMap;

export function initModel(type: ModelType) {
  return modelFactoryMap[type]();
}
