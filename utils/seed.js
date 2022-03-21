const connection = require('../config/connection');
const { User } = require('../models');
const UserData = require('./data');

connection.on('error', (err) => err);

connection.once('open', async () => {
  console.log('connected');

  // Delete all users
  await User.deleteMany({});
  const users = UserData.data;

  // Add users to the collection and await the results
  await User.collection.insertMany(users);

  // Log out the seed data to indicate what should appear in the database
  console.table(UserData);
  console.info('Seeding complete! 🌱');
  process.exit(0);
});
