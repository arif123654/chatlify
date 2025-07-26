import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://arif23:6BVhL1dagWtnd5kf@cluster0.p7azp2f.mongodb.net/chats?retryWrites=true&w=majority';
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected...');
  } catch (err: any) {
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;