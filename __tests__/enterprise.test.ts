import 'dotenv/config';
import { app } from '../src/app';
import request from 'supertest';
import { connect, connection } from 'mongoose';

import { IUser, User } from '../src/models/user';
import { Enterprise, IEnterprise } from '../src/models/enterprise';
import { generateTokenForTests } from '../src/middleware/auth';
import { Employee } from '../src/models/employee';
import { createHash } from 'crypto';
import { CreatorCoin } from '../src/models/coinCreator';
import { Wallet } from '../src/models/wallet';

let user: IUser;
let tokenuser: string;
let enterprise: IEnterprise;
let upEnterprise: any;

describe('Enterprise features', () => {
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
    await Enterprise.deleteMany({});
    await Wallet.deleteMany({});
    await Employee.deleteMany({});

    user = await User.create({
      name: 'joao',
      age: 20,
      cpf: '829.705.890-52',
      password: '123456',
      moneyoutcoins: 100000,
    });
    tokenuser = generateTokenForTests(user.toJSON());

    enterprise = await Enterprise.create({
      name: 'enterprise',
      owners: user._id,
      cnpj: '63.055.076/1000-80',
      email: 'test@email.com',
      password: '123456',
      moneyoutcoins: 1000000,
    });
  });

  it('POST /registerenterprise - creation of a company', async () => {
    const infosRegister = {
      name: 'enterprise test',
      owners: 'joao',
      cnpj: '63.055.076/0001-34',
      email: 'test@test.com',
      password: '123456',
      moneyoutcoins: 100000,
    } as const;
    const response = await request(app)
      .post('/registerenterprise')
      .auth(tokenuser, { type: 'bearer' })
      .send(infosRegister);
    expect(response.status).toEqual(201);

    const findEnterprise = await Enterprise.findOne({
      name: infosRegister.name,
    });
    if (!findEnterprise) throw new Error('the company was not created');
    const upEnterprise = await Enterprise.findByIdAndUpdate(
      { _id: findEnterprise._id },
      { $push: { owners: user._id } },
      { new: true }
    );
    expect(upEnterprise?.owners).toContainEqual(user._id);

    const upOwner = await User.findByIdAndUpdate(
      { _id: user._id },
      { $push: { ownerenterprise: findEnterprise._id } },
      { new: true }
    );
    expect(upOwner?.ownerenterprise).toContainEqual(findEnterprise._id);

    const newEmployees = await Employee.create({
      enterprise: findEnterprise._id,
    });
    expect(newEmployees.enterprise).toEqual(findEnterprise._id);
  });

  it('POST /createcoinenterprise - creating company coins', async () => {
    const infosCoin = { namecoin: 'test', objectivecoin: 'test obj' } as const;

    const createNameHash = createHash('md5')
      .update(`${infosCoin.namecoin}`)
      .digest('hex');

    const newCoin = new CreatorCoin({
      nameEnterprise: enterprise.name,
      namecoin: infosCoin.namecoin,
      namecoinhash: createNameHash,
      objectivecoin: infosCoin.objectivecoin,
      currentmarketvalue: 2000,
    });
    await newCoin.save();
    expect(newCoin.nameEnterprise).toEqual(enterprise.name);
    expect(newCoin.namecoin).toEqual(infosCoin.namecoin);
    expect(newCoin.namecoinhash).toBe(createNameHash);
    expect(newCoin.objectivecoin).toBe(infosCoin.objectivecoin);
    expect(newCoin.currentmarketvalue).toBe(2000);

    for (let i = 0; i < 10; i++) {
      const anyupdate = Math.random() * 99999999958;
      const publick = Math.random() * 9999999997;
      const privatek = Math.random() * 9999999996;

      const hashCoin = createHash('sha512')
        .update(`${anyupdate}` + i)
        .digest('hex');

      const publicKey = createHash('sha256').update(`${publick}`).digest('hex');
      const privateKey = createHash('sha256')
        .update(`${privatek}`)
        .digest('hex');

      const newWallet = new Wallet({
        amount: 2000,
        hash: `${createNameHash}.${hashCoin}`,
        currentowner: enterprise.id,
        publickey: publicKey,
        privatekey: privateKey,
      });
      await newWallet.save();
      expect(newWallet.amount).toEqual(2000);
      expect(newWallet.hash).toBeTruthy();
      expect(newWallet.currentowner).toEqual(
        expect.stringContaining(`${enterprise.id}`)
      );
      expect(newWallet.publickey).toBe(publicKey);
      expect(newWallet.privatekey).toBe(privateKey);

      upEnterprise = await Enterprise.findByIdAndUpdate(
        { _id: enterprise._id },
        {
          $push: { coins: newWallet._id },
          $inc: { moneyoutcoins: -2000, moneyincoins: newWallet.amount },
        },
        { new: true }
      );
      expect(upEnterprise.coins).toBeTruthy();
    }
    const lessMoneyoutcoins = enterprise.moneyoutcoins - 2000 * 10;
    expect(upEnterprise.moneyoutcoins).toEqual(lessMoneyoutcoins);
    const totalMoneyincoins = 2000 * 10;
    expect(upEnterprise.moneyincoins).toEqual(totalMoneyincoins);
  });
});
