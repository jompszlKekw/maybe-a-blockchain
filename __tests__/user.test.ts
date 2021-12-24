import 'dotenv/config';
import { app } from '../src/app';
import request from 'supertest';
import { connect, connection } from 'mongoose';

import { User, IUser } from '../src/models/user';
import { Wallet } from '../src/models/wallet';
import { CreatorCoin } from '../src/models/coinCreator';
import { generateTokenForTests } from '../src/middleware/auth';
import { createHash } from 'crypto';

let user: IUser;
let token: string;

describe('User features', () => {
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
    await Wallet.deleteMany({});
    await CreatorCoin.deleteMany({});

    user = await User.create({
      name: 'joao',
      age: 20,
      cpf: '829.705.890-52',
      password: '123456',
      moneyoutcoins: 100000,
    });
    token = generateTokenForTests(user.toJSON());
  });

  it('should be able to create a new user', async () => {
    const firstUser = await request(app).post('/newuser').send({
      name: 'lucas',
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

    expect(firstUser.status).toEqual(201);
    expect(firstUser.body).toBeTruthy();
    expect(response.status).toEqual(400);
  });

  it('POST /createcoin - creating user coins', async () => {
    const infosCoin = {
      namecoin: 'testcreator',
      objectivecoin: 'buy coins in games',
    } as const;

    const creatorCoin = await request(app)
      .post('/createcoin')
      .auth(token, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .send(infosCoin);

    const duplicateCoin = await request(app)
      .post('/createcoin')
      .auth(token, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .send(infosCoin);

    const NameHash = createHash('md5')
      .update(`${infosCoin.namecoin}`)
      .digest('hex');
    const valuecoin = Math.floor(Math.random() * 100000);

    if (valuecoin > 50000) {
      for (let i = 0; i < 5; i++) {
        const anyupdate = Math.random() * 9999999998;
        const publick = Math.random() * 9999999997;
        const privatek = Math.random() * 9999999996;
        const hashCoin = createHash('sha512')
          .update(`${anyupdate}` + i)
          .digest('hex');
        const publicKey = createHash('sha512')
          .update(`${publick}`)
          .digest('hex');
        const privateKey = createHash('sha512')
          .update(`${privatek}`)
          .digest('hex');

        const newWallets = new Wallet({
          amount: valuecoin,
          hash: `${NameHash}.${hashCoin}`,
          currentowner: user._id,
          publickey: publicKey,
          privatekey: privateKey,
        });
        await newWallets.save();
        expect(newWallets.amount).toBe(valuecoin);
        expect(newWallets.hash).toBe(`${NameHash}.${hashCoin}`);
        expect(newWallets.currentowner).toEqual(
          expect.stringContaining(`${user._id}`)
        );
        expect(newWallets.publickey).toBe(publicKey);
        expect(newWallets.privatekey).toBe(privateKey);

        const upUser = await User.findOneAndUpdate(
          { _id: user._id },
          {
            $push: {
              totalcoins: newWallets._id,
            },
            $inc: { moneyincoins: newWallets.amount },
          },
          { new: true }
        );

        expect(upUser?.totalcoins).toBeTruthy();
        expect(upUser?.moneyincoins).toBeTruthy();
      }
    } else {
      for (let i = 0; i < 10; i++) {
        const anyupdate = Math.random() * 9999999998;
        const publick = Math.random() * 9999999997;
        const privatek = Math.random() * 9999999996;
        const hashCoin = createHash('sha512').update(`${anyupdate}` + i);
        const publicKey = createHash('sha512')
          .update(`${publick}`)
          .digest('hex');
        const privateKey = createHash('sha512')
          .update(`${privatek}`)
          .digest('hex');

        const newWallets = new Wallet({
          amount: valuecoin,
          hash: `${NameHash}.${hashCoin}`,
          currentowner: user._id,
          publickey: publicKey,
          privatekey: privateKey,
        });
        await newWallets.save();
        expect(newWallets.amount).toBe(valuecoin);
        expect(newWallets.hash).toBe(`${NameHash}.${hashCoin}`);
        expect(newWallets.currentowner).toEqual(
          expect.stringContaining(`${user._id}`)
        );
        expect(newWallets.publickey).toBe(publicKey);
        expect(newWallets.privatekey).toBe(privateKey);

        const upUser = await User.findOneAndUpdate(
          { _id: user._id },
          {
            $push: {
              totalcoins: newWallets._id,
            },
            $inc: { moneyincoins: newWallets.amount },
          },
          { new: true }
        );
        expect(upUser?.totalcoins).toBeTruthy();
        expect(upUser?.moneyincoins).toBeTruthy();
      }
    }

    expect(creatorCoin.status).toEqual(201);
    expect(duplicateCoin.status).toEqual(400);
  });
});
