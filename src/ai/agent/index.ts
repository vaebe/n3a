import { createAgent, createMiddleware, ToolMessage } from 'langchain';
import { getWeather } from './utils/tools';
import { mimoModel } from './models/mimo';
import { PostgresSaver } from '@langchain/langgraph-checkpoint-postgres';

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

if (!process.env.NEON_PG_DB) {
  console.error('checkpointer db url 不存在！');
}

// 系统提示：告诉 AI 它的角色和可用工具
const systemPrompt = `
# 你是一个通用代理

# 你拥有的工具
getWeather: 获取天气情况
`;

const checkpointer = PostgresSaver.fromConnString(process.env.NEON_PG_DB ?? '');
checkpointer.setup().catch((e) => {
  console.error('checkpointer setup error', e);
  throw e;
});

export const agent = createAgent({
  model: mimoModel,
  tools: [getWeather],
  middleware: [handleToolErrors],
  systemPrompt,
  checkpointer: checkpointer,
});
