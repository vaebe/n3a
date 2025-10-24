# 基础镜像
FROM node:22-alpine AS dependencies

# 安装 pnpm
RUN corepack enable && corepack prepare pnpm@10.19.0 --activate

WORKDIR /app

# 复制 package 文件
COPY package.json pnpm-lock.yaml ./

# 安装生产依赖
RUN pnpm install --prod --frozen-lockfile && \
    # 缓存生产依赖
    cp -R node_modules /prod_node_modules && \
    # 安装全部依赖（包括开发依赖）
    pnpm install --frozen-lockfile

# 多阶段构建 - 阶段2: 构建应用
FROM node:20-alpine AS build

# 安装 pnpm
RUN corepack enable && corepack prepare pnpm@10.19.0 --activate

WORKDIR /app

# 从依赖阶段复制 node_modules
COPY --from=dependencies /app/node_modules ./node_modules

# 复制源代码
COPY . .

# 构建 NestJS 应用
RUN pnpm run build

# 多阶段构建 - 阶段3: 生产镜像
FROM node:20-alpine AS production

# 安装 dumb-init 用于正确处理信号
RUN apk add --no-cache dumb-init

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# 设置工作目录
WORKDIR /app

# 从依赖阶段复制生产依赖
COPY --from=dependencies --chown=nestjs:nodejs /prod_node_modules ./node_modules

# 从构建阶段复制构建产物
COPY --from=build --chown=nestjs:nodejs /app/dist ./dist
COPY --from=build --chown=nestjs:nodejs /app/package.json ./

# 切换到非 root 用户
USER nestjs

# 环境变量 - 可通过启动参数覆盖
ENV PORT=3000 \
    NODE_ENV=production \
    HOST=0.0.0.0

# 暴露端口（动态）
EXPOSE ${PORT}

# 使用 dumb-init 作为入口点
ENTRYPOINT ["dumb-init", "--"]

# 启动应用，使用环境变量
CMD ["sh", "-c", "node dist/main"]