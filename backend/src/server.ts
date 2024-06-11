import Logger from './core/Logger';
import app from './app';
import http from 'http';
import { Server } from 'socket.io';
import { ClientToServerEvents, ServerToClientEvents } from './types';

export const server = http.createServer(app);
export const io = new Server<ClientToServerEvents, ServerToClientEvents>(
  server,
  {
    cors: {
      origin: process.env.CORS_URL || '*',
    },
  },
);

export const onlineUsers = new Map<string, string>();
let isEmitting = false;
let sendOnlineUsers: NodeJS.Timeout;

io.on('connection', (socket) => {
  console.log(
    'DEV SERVER: user connected, online user count:',
    onlineUsers.size,
  );

  socket.on('update', (data, callback) => {
    const { socketId, name = socketId } = data;
    const updatedUser = { socketId, name };

    onlineUsers.delete(socketId);
    onlineUsers.set(socketId, name);

    io.emit('update', updatedUser);
    callback({
      ok: true,
    });
  });

  socket.on('join', (data): void => {
    const { socketId, name = socketId } = data;
    onlineUsers.set(socketId, name);
  });

  socket.on('broadcast', (broadcast, callback) => {
    io.emit('broadcast', broadcast);
    callback({
      ok: true,
    });
  });

  socket.on('private_message', (message, callback) => {
    const { from: sourceSocketId, to: targetSocketId } = message;
    io.to(targetSocketId).emit('private_message', message);
    io.to(sourceSocketId).emit('private_message', message);
    callback({
      ok: true,
    });
  });

  socket.on('disconnect', () => {
    onlineUsers.delete(socket.id);
    console.log(
      'PRODUCTION SERVER: user disconnected, online user count:',
      onlineUsers.size,
    );
    if (isEmitting && onlineUsers.size === 0) {
      clearInterval(sendOnlineUsers);
      isEmitting = false;
    }
  });

  if (!isEmitting) {
    sendOnlineUsers = setInterval(() => {
      io.emit('online_user', Object.fromEntries(onlineUsers));
    }, 5000);
    isEmitting = true;
  }
});

server.listen(process.env.PORT || 3001, () => {
  console.log(`server running on port : ${process.env.PORT || 3001}`);
  Logger.info(`server running on port : ${process.env.PORT || 3001}`);
});
server.on('error', (e) => {
  console.log(e);
  Logger.error(e);
});
