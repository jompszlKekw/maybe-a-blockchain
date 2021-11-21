import 'dotenv/config';
import { connect } from 'mongoose';

const uri = process.env.mongodbUrl;

try {
  connect(`${uri}`);

  console.log('Mongodb connected');
} catch (err: any) {
  console.log(err.message);
}
