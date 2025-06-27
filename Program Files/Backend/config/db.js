const mongoose = require('mongoose');


const connectDB = async () => {
  try {
    // Deprecated options have been removed
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:'.red, err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected'.yellow);
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination'.magenta);
      process.exit(0);
    });

  } catch (error) {
    console.error('Database connection failed:'.red.bold, error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
