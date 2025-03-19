import { app } from './app.js';
import dotenv from 'dotenv';
import { connectToDb } from './db/index.js';
dotenv.config({ path: './config.env' });
connectToDb().then(()=>{
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`App listening on port ${PORT}`);
  });
  
}).catch((err)=>
{
  console.log('err',err)
})

