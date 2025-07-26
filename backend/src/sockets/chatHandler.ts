import { Server, Socket } from 'socket.io';

export const handleSocketConnections = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('A user connected:', socket.id);

    socket.on('sendMessage', (message) => {
      io.emit('receiveMessage', message);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};