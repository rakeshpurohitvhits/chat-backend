import mongoose from "mongoose";

export const connectToDataBase = async () => {
    try {
        if (!process.env.MONGO_URL) {
            throw new Error("MONGO_URL is not defined in environment variables");
        }
        const uri = process.env.MONGO_URL.trim();
        await mongoose.connect(uri);

        console.log("Database connected");
    } catch (error) {
        console.error("Database connection error:", error.message);
        throw error; // Re-throw to stop server initialization
    }
}

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tls: true,
  tlsAllowInvalidCertificates: true
});