const express = require('express');
const path = require('path');
const { createServer } = require('http');

const app = express();
const server = createServer(app);
const port = process.env.PORT || 3000;

// 静态文件目录
const staticDir = path.join(__dirname, 'dist/static');
app.use(express.static(staticDir));

// 处理SPA路由
app.get('*', (req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

// 启动服务器
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});