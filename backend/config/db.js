const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
            .then(() => console.log("MongoDB connected successfully"))
            .catch(err => {
                console.error("MongoDB connection error:", err);
            });
    } catch (error) {
        process.exit(1);
    }
};

module.exports = connectDB;