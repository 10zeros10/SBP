require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(bodyParser.json());

const users = [];
const posts = [];

app.post('/users', (req, res) => {
  const { username, password } = req.body;
  const userId = users.length + 1;
  const newUser = { id: userId, username, password };
  users.push(newUser);
  res.status(201).send(newUser);
});

app.get('/users', (req, res) => {
  res.status(200).send(users);
});

app.post('/posts', (req, res) => {
  const { title, content, authorId } = req.body;
  const postId = posts.length + 1;
  const newPost = { id: postId, title, content, authorId };
  posts.push(newPost);
  io.emit('new-post', newPost);
  res.status(201).send(newPost);
});

app.get('/posts', (req, res) => {
  res.status(200).send(posts);
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));