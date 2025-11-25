import { DataAPIClient } from '@datastax/astra-db-ts';
import { env } from './env';

let astraClient: DataAPIClient | null = null;

export const getAstraClient = (): DataAPIClient => {
  if (!env.astraDbToken || !env.astraDbEndpoint) {
    throw new Error(
      'AstraDB credentials not configured. Please set ASTRA_DB_APPLICATION_TOKEN and ASTRA_DB_ENDPOINT in .env'
    );
  }

  if (!astraClient) {
    astraClient = new DataAPIClient(env.astraDbToken);
  }
  return astraClient;
};

export const getAstraCollection = async () => {
  const client = getAstraClient();

  // connect to the intended database & keyspace
  const db = client.db(env.astraDbEndpoint, {
    token: env.astraDbToken,
    keyspace: env.astraDbKeyspace,
  });

  // get the collection (document store) inside that keyspace
  return db.collection(env.astraDbCollection);
};

export const connectAstraDB = async (): Promise<void> => {
  try {
    const client = getAstraClient();

    // To use admin operations such as listing databases
    const admin = client.admin();  // <--- use admin()
    const databases = await admin.listDatabases();
    console.log('Databases:', databases);

    // Then proceed to check your keyspace and collection via the data side
    const db = client.db(env.astraDbEndpoint, {
      token: env.astraDbToken,
      keyspace: env.astraDbKeyspace,
    });
    const collections = await db.listCollections();
    console.log('Collections:', collections);

    console.log('✅ AstraDB connected successfully');
    console.log(`   Keyspace: ${env.astraDbKeyspace}`);
    console.log(`   Collection: ${env.astraDbCollection}`);
  } catch (error) {
    console.error('❌ AstraDB connection error:', error);
    console.warn('⚠️ Continuing without AstraDB connection. Make sure to configure it before using features that depend on it.');
  }
};
