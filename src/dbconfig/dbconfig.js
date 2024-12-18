import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    throw new Error('Please define the MONGO_URI environment variable inside .env.local');
}

let cached = global.mongo;

if (!cached) {
    cached = global.mongo = { conn: null, promise: null };
}

const connectDB = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGO_URI).then((mongoose) => mongoose);
    }

    cached.conn = await cached.promise;
    return cached.conn;
};

export default connectDB;
