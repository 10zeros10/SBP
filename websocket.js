const WebSocket = require('ws');
require('dotenv').config();
const wss = new WebSocket.Server({ port: process.env.WS_PORT || 8080 });
const broadcastData = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};
const setupWebSocketServer = () => {
  wss.on('connection', (ws) => {
    ws.on('message', (message) => {
      const parsedMessage = JSON.parse(message);
      switch (parsedMessage.type) {
        case 'postUpdate':
          broadcastData({ type: 'postUpdate', content: parsedMessage.content });
          break;
        default:
          console.log('Unknown message type:', parsedMessage.type);
      }
    });
    ws.on('close', () => {
      console.log('Client disconnected');
    });
    ws.send(JSON.stringify({ type: 'connection', content: 'Connection established' }));
  });
  console.log(`WebSocket server started on port ${process.env.WS_PORT || 8080}`);
};
const synchronizePosts = (postContent) => {
  broadcastData({ type: 'synchronizePosts', content: postContent });
};
module.exports = {
  setupWebSocketServer,
  broadcastData,
  synchronizePosts,
};
setupWebSocketServer();