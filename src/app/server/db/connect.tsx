import mongoose from 'mongoose';

/** 
Source : 
https://github.com/vercel/next.js/blob/canary/examples/with-mongodb-mongoose/utils/dbConnect.js 
**/

const { DB_HOST } = process.env;

if (!DB_HOST) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
// let cached = global.mongoose;

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }

async function dbConnect() {
  //   if (cached.conn) {
  //     return cached.conn;
  //   }

  //   if (!cached.promise) {
  const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    bufferCommands: false,
    // bufferMaxEntries: 0,
    // useFindAndModify: true,
    // useCreateIndex: true,
    // strictQuery: false,
  };

  // cached.promise = mongoose.connect(DB_HOST, opts).then((mongoose) => {
  //   return mongoose;
  // });
  const promise = mongoose.connect(DB_HOST!, opts).then((mongooseResponse) => {
    console.log('db connected');
    return mongooseResponse;
  });
  // }
  //   cached.conn = await cached.promise;
  //   return cached.conn;
  const conn = await promise;
  return conn;
}

export default dbConnect;
