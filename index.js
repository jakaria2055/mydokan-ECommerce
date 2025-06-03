import 'dotenv/config'
import mongoose from 'mongoose';
import { MONGO_URL, PORT } from './src/config/config.js';
import app from './app.js';


mongoose.connect(MONGO_URL).then(()=>{
    console.log("Database Connected.");

    app.listen(PORT, ()=>{
        console.log(`Server started at ${PORT}`);
    })

}).catch((err)=>{
    console.log(`Databsse connection is error due to `, err);
})
