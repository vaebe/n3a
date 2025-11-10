module.exports = {
  apps: [{
    name: 'n3a',
    script: './dist/main.js',
    instances: 1, // 启动实例的数量
    exec_mode: 'fork', // 执行模式："fork"（默认）单进程模式 "cluster" 多进程模式，支持负载均衡。
    env: {
      NODE_ENV: 'production',
      PORT: 9001
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    max_memory_restart: '0.5G', // 当单个进程占用内存超过此值时自动重启
    autorestart: true, // 应用崩溃后是否自动重启
    watch: false // 是否监听文件变化自动重启
  }]
};