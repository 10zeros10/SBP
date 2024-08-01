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
  try {
    const { username, password } = req.body;
    if (!username || !password) throw new Error('Username and password are required');
    
    const userId = users.length + 1;
    const newUser = { id: userId, username, password };
    users.push(newUser);
    res.status(201).send(newUser);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

app.get('/users', (req, res) => {
  try {
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.post('/posts', (req, res) => {
  try {
    const { title, content, authorId } = req.body;
    if (!title || !content || !authorId) throw new Error('Title, content, and authorId are required');

    if (!users.some(user => user.id === authorId)) throw new Error('Author not found');

    const postId = posts.length + 1;
    const newPost = { id: postId, title, content, authorId };
    posts.push(newPost);
    io.emit('new-post', newPost);
    res.status(201).send(newPost);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

app.get('/posts', (req, res) => {
  try {
    const { authorId } = req.query;
    if (authorId) {
      const filteredPosts = posts.filter(post => post.authorId == authorId);
      res.status(200).send(filteredPosts);
    } else {
      res.status(200).send(posts);
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));