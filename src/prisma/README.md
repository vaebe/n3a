# prisma

1. prisma 目录在 nest 中可以放到 src 文件夹中，需要在根目录下的 `prisma.config.ts` 中进行配置

## 操作

```bash
# 生成迁移
npx prisma migrate dev --name init

# 生成 Client
npx prisma generate
```
