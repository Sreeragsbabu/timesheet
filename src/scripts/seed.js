require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ctm';

(async () => {
    await mongoose.connect(MONGO);

    console.log('connected to mongo for seeding...');
    await User.deleteMany({});

      const admin = new User({ name: 'Admin', email: 'admin@example.com', passwordHash: await bcrypt.hash('123', 10), role: 'admin', empId: '1001' });
      await admin.save();
      console.log('admin created');
})();