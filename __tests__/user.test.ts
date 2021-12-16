import 'dotenv/config';
import { app } from '../src/app';
import request from 'supertest';
import { connect, connection } from 'mongoose';

import { User } from '../src/models/user';

describe('User controller', () => {
  beforeAll(async () => {
    if (!process.env.MONGO_URL) {
      throw new Error('mongoDb server not initialized');
    }
    const uri = process.env.MONGO_URL;
    await connect(`${uri}`);
  });

  afterAll(async () => {
    await connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should be able to create a new user', async () => {
    const response = await request(app).post('/newuser').send({
      name: 'joao',
      age: 20,
      cpf: '829.705.890-52',
      password: 'jojojgg',
      // moneyoutcoins: 10000,
    });

    expect(response.status).toEqual(201);
    expect(response.body).toBeTruthy();
  });

  it('should not able to create an existing user', async () => {
    await request(app).post('/newuser').send({
      name: 'joao',
      age: 20,
      cpf: '829.705.890-52',
      password: 'jojojgg',
      moneyoutcoins: 10000,
    });

    const response = await request(app).post('/newuser').send({
      name: 'joao',
      age: 20,
      cpf: '829.705.890-52',
      password: 'jojojgg',
      moneyoutcoins: 10000,
    });

    expect(response.status).toEqual(400);
  });
});
