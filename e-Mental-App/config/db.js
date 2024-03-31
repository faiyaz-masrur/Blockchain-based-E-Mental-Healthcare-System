const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
    try {
        // Connect to MongoDB database using the connection string.
        await mongoose.connect(process.env.MONGO_URL);
        console.log(
            `Mongodb connected ${mongoose.connection.host}`.bgGreen.white
        );
    } catch (error) {
        console.log(`Error connecting to Mongodb: ${error}`.red.bold);
    }
};

module.exports = connectDB;
