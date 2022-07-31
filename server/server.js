import { app } from './app.js';
import { connectDB } from './config/database.js';

import dotenv from 'dotenv';

dotenv.config({ path: './config/config.env' })

connectDB();

app.listen(process.env.PORT, () => {
    console.log(`Server is running on localhost:${process.env.PORT}`);
})

