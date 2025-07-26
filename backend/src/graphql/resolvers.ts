import Message from '../models/Message';
import { Server } from 'socket.io';

interface GraphQLContext {
  io: Server;
}

const resolvers = {
  Query: {
    // Retrieve all messages from MongoDB, sorted by creation time
    messages: async () => {
      try {
        return await Message.find().sort({ timestamp: 1 });
      } catch (error) {
        console.error('Could not fetch messages', error);
        return [];
      }
    },
  },
  Mutation: {
    // Create a message, save it to DB, and broadcast its JSON version
    createMessage: async (
      _: any,
      { user, content }: { user: string; content: string },
      context: GraphQLContext
    ) => {
      const newMessage = new Message({ user, content });
      try {
        await newMessage.save();

        // **THE FIX**: Emit the plain JSON object, not the Mongoose document.
        // This ensures the timestamp is a standard ISO string.
        context.io.emit('receiveMessage', newMessage.toJSON());

        return newMessage;
      } catch (error) {
        console.error('Could not create message', error);
        throw new Error('Failed to create message');
      }
    },
  },
};

export default resolvers;