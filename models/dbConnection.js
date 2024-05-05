const mongoose = require('mongoose');
const dotenv = require('dotenv');

const dbConnectionMiddleware = async (req, res) => {
    dotenv.config();
    const dblink = process.env.DBLINK;
    try {
        await mongoose.connect(dblink);
        console.log('Connected to MongoDB');
      } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
};

module.exports = dbConnectionMiddleware;