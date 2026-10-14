import mongoose from 'mongoose';

const TEST_DATABASE_PREFIX = 'wordbitx_test_';

type ConnectionCache = {
  uri?: string;
  promise?: Promise<typeof mongoose>;
};

const globalForMongoose = globalThis as typeof globalThis & {
  wordbitxMongoose?: ConnectionCache;
};

function getDatabaseName(uri: string): string {
  let parsed: URL;
  try {
    parsed = new URL(uri);
  } catch {
    throw new Error('MongoDB connection URI is invalid.');
  }

  if (parsed.protocol !== 'mongodb:' && parsed.protocol !== 'mongodb+srv:') {
    throw new Error('MongoDB connection URI must use mongodb or mongodb+srv.');
  }

  const databaseName = decodeURIComponent(parsed.pathname.slice(1));
  if (!databaseName || databaseName.includes('/')) {
    throw new Error('MongoDB connection URI must include a database name.');
  }
  return databaseName;
}

export function validateMongoUri(uri: string | undefined, environment = process.env.NODE_ENV): string {
  if (!uri?.trim()) {
    throw new Error('MONGODB_URI is required.');
  }

  const databaseName = getDatabaseName(uri);
  if (environment === 'test' && !databaseName.startsWith(TEST_DATABASE_PREFIX)) {
    throw new Error(`Test MongoDB database names must start with "${TEST_DATABASE_PREFIX}".`);
  }
  if (environment !== 'test' && databaseName.startsWith(TEST_DATABASE_PREFIX)) {
    throw new Error('A test-only MongoDB database cannot be used outside the test environment.');
  }
  return uri;
}

export async function connectToDatabase(uri = process.env.MONGODB_URI): Promise<typeof mongoose> {
  const validatedUri = validateMongoUri(uri);
  const cache = (globalForMongoose.wordbitxMongoose ??= {});

  if (cache.promise && cache.uri !== validatedUri) {
    throw new Error('A different MongoDB connection is already being initialized.');
  }

  if (mongoose.connection.readyState === 1) {
    if (cache.uri !== validatedUri) {
      throw new Error('A different MongoDB connection is already active.');
    }
    return mongoose;
  }

  if (!cache.promise) {
    cache.uri = validatedUri;
    cache.promise = mongoose.connect(validatedUri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10_000,
    }).catch((error: unknown) => {
      cache.promise = undefined;
      cache.uri = undefined;
      throw error;
    });
  }

  await cache.promise;
  return mongoose;
}

export async function disconnectFromDatabase(): Promise<void> {
  await mongoose.disconnect();
  globalForMongoose.wordbitxMongoose = undefined;
}
