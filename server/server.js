import { WebSocketServer } from 'ws';

const server = new WebSocketServer({ port: 3001 });

server.on('connection', (socket) => {
  console.log('새로운 클라이언트 연결됨.');

  socket.on('message', (message) => {
    console.log('수신 메시지:', message.toString());

    server.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(message.toString());
      }
    });
  });

  socket.on('close', () => {
    console.log('클라이언트 연결 종료');
  });

  socket.on('error', (err) => {
    if (err.code === 'ECONNRESET') {
      console.warn('클라이언트 연결이 강제로 종료되었습니다.');
    } else {
      console.error('WebSocket 소켓 에러 발생:', err.message);
    }
  });
});

server.on('error', (err) => {
  console.error('WebSocket 서버 에러 발생:', err.message);
});

console.log('WebSocket 서버가 3001번 포트에서 실행 중입니다.');
