import mongoose from "mongoose";

export const connectDB = () => {
    try {
        mongoose
            .connect(`${process.env.MONGO_URI}`, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
            .then((data) => {
                console.log(
                    `MongoDB connected with server: ${data.connection.host}`
                );
            });
    } catch (error) {
        console.log(err);
        process.exit(1);
    }
};
