import { app } from './app.js';
import dotenv from 'dotenv';
import { connectToDb } from './db/index.js';
dotenv.config({ path: './config.env' });
connectToDb().then(()=>{
  app.listen(process.env.PORT||5000,() => {
    console.log(`App listening on http://localhost:5000`);
  });
}).catch((err)=>
{
  console.log('err',err)
})

