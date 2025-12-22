import { ChatOpenAI } from '@langchain/openai';

export const mimoModel = new ChatOpenAI({
  model: 'mimo-v2-flash',
  apiKey: process.env.MIMO_API_KEY ?? '',
  configuration: {
    baseURL: 'https://api.xiaomimimo.com/v1',
  },
});
