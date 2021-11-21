import './config/database';
import { app } from './app';

const PORT = 7683;

app.listen(PORT, () => {
  console.log(`server is running in port: http://localhost:${PORT} `);
});