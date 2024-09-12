const WebSocket = require('ws');
require('dotenv').config();

let wss;
try {
  wss = new WebSocket.Server({ port: process.env.WS_PORT || 8080 });
} catch (error) {
  console.error(`Failed to start the WebSocket server: ${error.message}`);
  process.exit(1);
}

const broadcastData = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      try {
        client.send(JSON.stringify(data));
      } catch (error) {
        console.error('Error sending message to a client:', error.message);
      }
    }
  });
};

const setupWebSocketServer = () => {
  wss.on('connection', (ws) => {
    ws.on('message', (message) => {
      let parsedMessage;
      try {
        parsedMessage = JSON.parse(message);
      } catch (error) {
        console.error('Error parsing message:', error.message);
        return;
      }

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

    try {
      ws.send(JSON.stringify({ type: 'connection', content: 'Connection established' }));
    } catch (error) {
      console.error('Error sending initial connection message:', error.message);
    }
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

try {
  setupWebSocketServer();
} catch (error) {
  console.error('Failed to set up WebSocket server:', error.message);
}