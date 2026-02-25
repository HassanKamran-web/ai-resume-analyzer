const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        mongoose.connect(process.env.MONGODB_URI)
            .then(() => console.log("MongoDB connected ✅"))
            .catch(err => console.error("MongoDB connection error:", err));
    } catch (error) {
        process.exit(1);
    }
};

module.exports = connectDB;