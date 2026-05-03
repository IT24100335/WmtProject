import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const uri = process.env.MONGODB_URI;
console.log('MONGODB_URI:', uri ? uri.replace(/(mongodb\+srv:\/\/[^:]+:)[^@]+(@.*)/, '$1***$2') : 'missing');
if (!uri) process.exit(1);

try {
  await mongoose.connect(uri, { dbName: 'cravebitesdb' });
  console.log('Connected to', mongoose.connection.name, 'host', mongoose.connection.host);
  const db = mongoose.connection.db;
  const collections = await db.listCollections().toArray();
  console.log('Collections:', collections.map((c) => c.name));
  for (const coll of collections) {
    const count = await db.collection(coll.name).countDocuments();
    console.log('- ' + coll.name + ': ' + count);
  }
} catch (err) {
  console.error(err);
  process.exit(1);
} finally {
  await mongoose.disconnect();
}
