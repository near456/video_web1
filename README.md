# 开源视频聊天应用

一个基于WebRTC技术的免费开源视频聊天应用，支持朋友间高清视频通话。

## 功能特点

- 免费高清视频通话
- 简单易用的联系人管理
- 无需注册即可试用基础功能
- 端到端加密保护隐私
- 支持多人视频通话

## 本地开发

### 环境要求

- Node.js 16+
- pnpm 7+

### 安装步骤

1. 克隆仓库
```bash
git clone https://github.com/yourusername/video-chat-app.git
cd video-chat-app
```

2. 安装依赖
```bash
pnpm install
```

3. 启动开发服务器
```bash
pnpm dev
```

4. 在浏览器中访问 `http://localhost:3000`

## 部署到服务器

### 构建生产版本

```bash
pnpm build
```

构建完成后，静态文件将生成在 `dist` 目录中。

### 服务器要求

- Node.js 16+ 环境
- 支持WebSocket的服务器环境(可选，用于多人通话)

### 部署步骤

1. 将项目文件上传到服务器

2. 安装生产依赖
```bash
pnpm install --production
```

3. 启动服务器
```bash
pnpm start
```

4. 应用将在 `http://your-server-ip:3000` 上运行

### 使用Nginx作为反向代理(推荐)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 技术栈

- React 18+
- TypeScript
- Tailwind CSS
- WebRTC (simple-peer)
- Vite