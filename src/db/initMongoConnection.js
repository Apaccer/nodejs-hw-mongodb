import mongoose from 'mongoose';
import { env } from '../utils/env.js';

export const initMongoConnection = async () => {
  const connectionLink = `mongodb+srv://${env('MONGODB_USER')}1:${env(
    'MONGODB_PASSWORD',
  )}@${env('MONGODB_URL')}/${env(
    'MONGODB_DB',
  )}?retryWrites=true&w=majority&appName=Cluster0`;

  try {
    await mongoose.connect(connectionLink);
    console.log('Mongo connection successfully established!');
  } catch (err) {
    console.log(err);
    throw err;
  }
};
