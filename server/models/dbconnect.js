const mongoose = require('mongoose');

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECT, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ MongoDB connected");

        
        const movieSchema = new mongoose.Schema({ title: String });
        const Movie = mongoose.model("Movie", movieSchema);

        const existing = await Movie.findOne({ title: "Test Movie" });
        if (!existing) {
            await Movie.create({ title: "Test Movie" });
            console.log("✅ Sample movie inserted");
        }

    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
    }
};

module.exports = dbConnect;
