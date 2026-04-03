import mongoose from "mongoose";

export const connectToDataBase=async()=>{
try {
    await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    
      console.log("Database connected");
} catch (error) {
    console.log(error);
}
}