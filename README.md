# nest crud

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
