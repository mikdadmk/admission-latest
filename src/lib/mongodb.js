// // / src/lib/mongodb.js
// import { MongoClient } from "mongodb";

// const uri = process.env.MONGODB_URI;
// let client;
// let clientPromise;

// if (!global._mongoClientPromise) {
//     client = new MongoClient(uri);
//     global._mongoClientPromise = client.connect();
// }
// clientPromise = global._mongoClientPromise;

// export default clientPromise;



// src/lib/mongodb.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
    throw new Error("❌ MONGODB_URI is not defined in environment variables.");
}

// ✅ Global cache to prevent re-connection issues on Vercel
let client;
let clientPromise;

if (!global._mongoClientPromise) {
    client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 30000, // ✅ Prevents MongoDB timeout
        connectTimeoutMS: 30000, // ✅ Prevents connection timeout
        tls: true, // ✅ Ensures MongoDB uses TLS/SSL
        directConnection: true, // ✅ Fixes Vercel connection issues
    });

    global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export default clientPromise;
