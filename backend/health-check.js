const http = require('http');

const options = {
  host: 'localhost',
  port: process.env.PORT || 3000,
  path: '/health',
  timeout: 2000,
  method: 'GET'
};

const request = http.request(options, (res) => {
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

request.on('error', (err) => {
  console.error('健康检查失败:', err);
  process.exit(1);
});

request.on('timeout', () => {
  console.error('健康检查超时');
  request.destroy();
  process.exit(1);
});

request.end();
