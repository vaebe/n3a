import { createAgent } from 'langchain';
import { getWeather, handleToolErrors } from './utils/tools';
import { openrouterModel } from './models/openrouter';
import { PostgresSaver } from '@langchain/langgraph-checkpoint-postgres';
import { systemPrompt } from './prompts';

/**
 * 这里的 agent 在 langgraph.json 中配置
 * 使用 npx @langchain/langgraph-cli dev 启动服务，用于调试 agent
 */

const checkpointer = PostgresSaver.fromConnString(process.env.NEON_PG_DB ?? '');
checkpointer.setup().catch((e) => {
  console.error('checkpointer setup error', e);
  throw e;
});

export const agent = createAgent({
  model: openrouterModel,
  tools: [getWeather],
  middleware: [handleToolErrors],
  systemPrompt,
  checkpointer: checkpointer,
});
