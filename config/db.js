const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        console.error("❌ MONGO_URI not found in .env");
        process.exit(1);
    }

    try {
        await mongoose.connect(uri); // ✅ No need for options
        console.log("✅ MongoDB Atlas connected");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
