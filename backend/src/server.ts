import app from './app';
import { connectDatabase } from './config/database';
import { connectAstraDB } from './config/astradb';
import { env } from './config/env';

const PORT = env.port;



// Start server
const startServer = async () => {
  try {
    // Connect to databases (these won't fail the server if not configured)
    await connectDatabase();
    await connectAstraDB();
    
    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📝 Environment: ${env.nodeEnv}`);
      console.log(`🌐 Frontend URL: ${env.frontendUrl}`);
      console.log(`\n📍 Health check: http://localhost:${PORT}/health\n`);
    });
  } catch (error) {
    console.log(error);
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

