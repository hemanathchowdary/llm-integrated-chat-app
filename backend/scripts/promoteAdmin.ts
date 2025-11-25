import mongoose from 'mongoose';
import '../src/config/env';
import User from '../src/models/User';
import { env } from '../src/config/env';

const run = async () => {
  const emailArg = process.argv[2];

  if (!emailArg) {
    console.error('❌ Please provide the user email.\nUsage: npm run promote-admin user@example.com');
    process.exit(1);
  }

  if (!env.mongodbUri) {
    console.error('❌ MONGODB_URI is not configured in the environment.');
    process.exit(1);
  }

  const email = emailArg.toLowerCase();

  try {
    await mongoose.connect(env.mongodbUri);

    const user = await User.findOne({ email });

    if (!user) {
      console.error(`❌ No user found with email: ${email}`);
      process.exit(1);
    }

    if (user.role === 'admin') {
      console.log(`ℹ️  User ${email} is already an admin.`);
      process.exit(0);
    }

    user.role = 'admin';
    await user.save();

    console.log(`✅ User ${email} has been promoted to admin.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to promote user to admin:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

run();

