import mongoose from "mongoose";

export const connectDB = () => {
    try {
        mongoose
            .connect(String('mongodb://localhost:27017/MERN-ReactNative'), {
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
