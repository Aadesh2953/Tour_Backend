import { app } from './app.js';
import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });

console.log(process.env.NODE_ENV);

app.listen(3000, () => {
  console.log(`App listening on http://localhost:3000`);
});
