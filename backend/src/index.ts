import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import cors from 'cors';

import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';
import { handleSocketConnections } from './sockets/chatHandler';
import connectDB from './db';

// Connect to MongoDB
connectDB();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*', // In production, restrict this to your frontend's domain
  },
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function startServer() {
  await server.start();

  app.use(cors());

  // Pass the io instance into the GraphQL context
  app.use(
    '/graphql',
    express.json(),
    expressMiddleware(server, {
      context: async () => ({ io }),
    })
  );


  handleSocketConnections(io);

  const PORT = process.env.PORT || 4000;
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
    console.log(`🔌 Socket.io listening on port ${PORT}`);
  });
}

startServer();