# n3a

使用 nest 、langchain.ts 构建 AI gent

## openrouter

项目使用 [openrouter]('https://openrouter.ai/') 提供的免费模型来实现功能！

## cli

| 类型            | 命令                             | 生成文件路径                          |
| ------------- | ------------------------------ | ------------------------------- |
| 模块            | `nest g module users`          | `src/users/users.module.ts`     |
| 控制器           | `nest g controller users`      | `src/users/users.controller.ts` |
| 服务            | `nest g service users`         | `src/users/users.service.ts`    |
| 网关（WebSocket） | `nest g gateway chat`          | `src/chat/chat.gateway.ts`      |
| 拦截器           | `nest g interceptor logging`   | `src/logging.interceptor.ts`    |
| 管道            | `nest g pipe validation`       | `src/validation.pipe.ts`        |
| 守卫            | `nest g guard auth`            | `src/auth.guard.ts`             |
| 过滤器           | `nest g filter http-exception` | `src/http-exception.filter.ts`  |
| 中间件           | `nest g middleware logger`     | `src/logger.middleware.ts`      |

```zsh
# module mo
nest generate module user 
# service s --no-spec 不生成测试文件
nest generate service user --no-spec
# controller sco
nest generate controller user --no-spec
```

## LangChain、AI SDK、Agent、LangSmith

### 1. LangChain 是什么？

LangChain 是一个 **构建 LLM 应用的全栈框架**，它的核心能力包括：

* **模型调用封装**：ChatOpenAI、chat.completions.create 等统一 API
* **工具调用（Tools）**
* **Agent 推理与执行框架**
* **RAG（检索增强）**
* **多步骤链式执行（Chains）**
* **LangGraph 图式工作流**
* **LangSmith 调试与监控工具**

你可以把 LangChain 理解为：

> “让 LLM 变成一个可控、可调试、有记忆、有工具、有工作流的应用框架。”

---

### 2. AI SDK 是什么？

AI SDK（Vercel AI SDK）是 Vercel 推出的 **前后端统一的 LLM 接入层**。

它的主要目标是：

* **统一所有模型厂商（OpenAI、Anthropic、本地 LLM…）**
* **让前端与后端都能轻松调用模型**
* **支持流式输出、工具调用、RSC（React Server Components）**

AI SDK 更像：

> “一个更现代、更前端友好的模型接入层，不带工作流，不带 Agent，聚焦模型调用 + 工具调用。”

---

### 3. LangChain vs AI SDK

#### 对比表

| 功能领域                | LangChain         | AI SDK             |
| ------------------- | ----------------- | ------------------ |
| **目标定位**            | 构建 AI App 的全栈框架   | 统一模型调用的轻量 SDK      |
| **工具调用（Tools）**     | 有完整工具系统           | 支持（与 OpenAI 格式兼容）  |
| **Agent**           | 内置 Agent 框架       | 无                  |
| **工作流（LangGraph）**  | 强大                | 无                  |
| **RAG**             | 内置 RAG 模块         | 无                  |
| **调试监控（LangSmith）** | 一体化支持             | 无                  |
| **前端集成**            | 弱                 | 极强（特别是 Next.js）    |
| **学习曲线**            | 较高                | 较低                 |
| **适合场景**            | 企业级、复杂 Agent、流程驱动 | 前端 AI 应用、模型调用、简单工具 |

一句话总结：

* **你想做 Agent、RAG、流程 → 用 LangChain**
* **你想做 Web AI 应用 → 用 AI SDK**
* **你想两个都要 → LangChain + AI SDK 最强组合**

---

### 4. 什么是 AI Agent？

Agent 是：

> “一个由 LLM 驱动的决策执行器，会根据目标自动调用工具、规划步骤、执行任务。”

能力包括：

* 自主规划步骤（Reasoning）
* 决定工具使用
* 多轮行动直到任务完成
* 可以接入外部 API、数据库、浏览器等

本质：
**让大模型不再只是聊天，而是能干活。**

---

### 5. 三种 Agent

下面是对那三类 Agent 的更清晰总结：

| Agent 类型                             | 特点                   | 适用场景          |
| ------------------------------------ | -------------------- | ------------- |
| **ReAct（推理 + 行动）**                   | 交替进行“思考”“行动”，最常见     | 多步骤推理、工具链式调用  |
| **OpenAI / OpenAI-Compatible Agent** | 基于模型的原生 tool calling | 明确工具调用、结构化输出  |
| **LangGraph Agent（图式控制）**            | 可控、可恢复、可监控、可并行       | 企业级、复杂流程、持久状态 |

---

## 6. langgraph.json 是什么？

**langgraph.json = LangGraph 与 LangSmith Studio 的桥梁文件。**

作用：

1. **定义当前 Graph 的节点与状态**
2. **告诉 LangSmith Studio 如何展示图**
3. **本地运行时：让 Studio 能够连接到本地的 Graph 结果流**
---

## 7. LangSmith 是什么？

LangSmith 是一套：

* **调试工具**
* **运行日志**
* **提示管理**
* **数据集评测**
* **Agent 逐步可视化**

帮助你：

* 调试 prompt
* 查看 Agent 执行路径（包括每次“思考”）
* 记录生产日志
* 测试模型质量

它相当于：

> “AI App 的全链路监控工具。”

---

## 8. LangSmith Studio 是什么？

**Studio = Browser-Based IDE（浏览器版 IDE）
用于开发和调试 LangGraph Agent。**

它可以：

* 一步步查看节点执行情况
* 查看消息流
* 修改 Graph 配置
* 热刷新

有点像：

> “Airflow + VSCode + Agent 可视化调试器 的结合体。”

---
