const { connect, connection } = require('mongoose');

const connectStr = process.env.MONGODB_URL || 'mongodb://localhost:27017/socialDB';

connect(connectStr, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = connection;
