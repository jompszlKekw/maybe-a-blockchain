import 'dotenv/config';
import { app } from '../src/app';
import request from 'supertest';
import { connect, connection } from 'mongoose';

import { IUser, User } from '../src/models/user';
import { IWallet, Wallet } from '../src/models/wallet';
import { CreatorCoin, ICoinCreator } from '../src/models/coinCreator';
import { createHash } from 'crypto';
import { generateTokenForTests } from '../src/middleware/auth';
import { Transaction } from '../src/models/transaction';

let token: string;
let user: IUser;
let creatorcoin: ICoinCreator;
let wallets: IWallet;

describe('Coin controller', () => {
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

    const defaultUser = {
      name: 'joao',
      age: 20,
      cpf: '829.705.890-52',
      password: '123456',
      moneyoutcoins: 100000,
    } as const;
    user = await new User(defaultUser).save();
    token = generateTokenForTests(user.toJSON());

    const NameHash = createHash('md5').update(`test`).digest('hex');
    const defaultCreatorCoin = {
      namecreator: defaultUser.name,
      namecoin: 'test',
      namecoinhash: NameHash,
      objectivecoin: 'comprar jogos',
      currentmarketvalue: 10000,
    } as const;
    creatorcoin = await new CreatorCoin(defaultCreatorCoin).save();
    for (let i = 0; i < 10; i++) {
      const anyupdate = Math.random() * 9999999998;
      const publick = Math.random() * 9999999997;
      const privatek = Math.random() * 9999999996;

      const hashCoin = createHash('sha256')
        .update(`${anyupdate}` + i)
        .digest('hex');

      const publicKey = createHash('sha256').update(`${publick}`).digest('hex');
      const privateKey = createHash('sha256')
        .update(`${privatek}`)
        .digest('hex');

      const newWallets = {
        amount: 10000,
        hash: `${NameHash}.${hashCoin}`,
        currentowner: user._id,
        publickey: publicKey,
        privatekey: privateKey,
        codingforbuy: 'codingtest',
        avaibleforpurchase: true,
      } as const;
      wallets = await new Wallet(newWallets).save();

      await User.findOneAndUpdate(
        { _id: user._id },
        {
          $push: {
            totalcoins: { coinid: wallets._id, namehash: NameHash },
          },
          $inc: { moneyincoins: wallets.amount },
        },
        { new: true }
      );
    }
  });

  it('criar user e o creator user', async () => {
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

        const hashCoin = createHash('sha256')
          .update(`${anyupdate}` + i)
          .digest('hex');

        const publicKey = createHash('sha256')
          .update(`${publick}`)
          .digest('hex');
        const privateKey = createHash('sha256')
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
        expect(newWallets.currentowner).toBe(user._id);
        expect(newWallets.publickey).toBe(publicKey);
        expect(newWallets.privatekey).toBe(privateKey);

        await User.findOneAndUpdate(
          { _id: user._id },
          {
            $push: {
              totalcoins: { coinid: newWallets._id, namehash: NameHash },
            },
            $inc: { moneyincoins: newWallets.amount },
          },
          { new: true }
        );
      }
    } else {
      for (let i = 0; i < 10; i++) {
        const anyupdate = Math.random() * 9999999998;
        const publick = Math.random() * 9999999997;
        const privatek = Math.random() * 9999999996;

        const hashCoin = createHash('sha256').update(`${anyupdate}` + i);

        const publicKey = createHash('sha256')
          .update(`${publick}`)
          .digest('hex');
        const privateKey = createHash('sha256')
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
        expect(newWallets.currentowner).toBe(user._id);
        expect(newWallets.publickey).toBe(publicKey);
        expect(newWallets.privatekey).toBe(privateKey);

        await User.findOneAndUpdate(
          { _id: user._id },
          {
            $push: {
              totalcoins: { coinid: newWallets._id, namehash: NameHash },
            },
            $inc: { moneyincoins: newWallets.amount },
          },
          { new: true }
        );
      }
    }

    expect(creatorCoin.status).toEqual(201);
    expect(duplicateCoin.status).toEqual(400);
  });

  it('fazer transação', async () => {
    const UserBid = new User({
      name: 'lucas',
      age: 20,
      cpf: '829.705.563-90',
      password: '123456',
      moneyoutcoins: 100000,
    });
    await UserBid.save();
    const tokenNewUser = generateTokenForTests(UserBid.toJSON());

    const findAnWallet = await Wallet.findOne({});
    if (!findAnWallet) throw new Error('não foi criado nenhuma wallet');
    const infosBuy = {
      publickey: findAnWallet.publickey,
      codingforbuy: 'codingtest',
      amount: 10000,
    } as const;
    const bidRequest = await request(app)
      .put('/codingtransaction')
      .auth(tokenNewUser, { type: 'bearer' })
      .send(infosBuy);
    const mathcoding = Math.random() * 9999999999;
    const codinghash = createHash('sha256')
      .update(`${mathcoding}`)
      .digest('hex');
    const newTransaction = new Transaction({
      coin: findAnWallet._id,
      amount: 10000,
      payer: UserBid._id,
      payee: wallets.currentowner,
      codingconfirm: codinghash,
    });
    await newTransaction.save();

    const myBidCoins = await request(app)
      .get('/seebidsonmycurrency')
      .auth(token, { type: 'bearer' })
      .expect(200);

    async function twostep() {
      const confirmBuy = {
        privatekey: findAnWallet?.privatekey,
        cofingforbuy: findAnWallet?.codingforbuy,
        codingconfirm: newTransaction.codingconfirm,
        confirmbuy: true,
        _id: findAnWallet?._id,
        hash: findAnWallet?.hash,
      } as const;

      const requestConfirmBuy = await request(app)
        .put('/confirmbuycoin')
        .auth(token, { type: 'bearer' })
        .send(confirmBuy);

      const anyupdate = Math.random() * 9999999999;
      const publick = Math.random() * 9999999999;
      const privatek = Math.random() * 9999999999;

      const hashCoin = createHash('sha256')
        .update(`${anyupdate}`)
        .digest('hex');
      const publicKey = createHash('sha256').update(`${publick}`).digest('hex');
      const privateKey = createHash('sha256')
        .update(`${privatek}`)
        .digest('hex');

      if (confirmBuy.confirmbuy === true) {
        await Wallet.findByIdAndUpdate(
          { _id: confirmBuy._id },
          {
            $inc: { index: 1 },
            $push: {
              prevHash: confirmBuy.hash,
              transactions: newTransaction._id,
            },
            hash: `${creatorcoin.namecoinhash}.${hashCoin}`,
            currentowner: newTransaction.payer,
            avaibleforpurchase: false,
            publickey: publicKey,
            privatekey: privateKey,
            update: new Date(),
            $unset: { confirm: '' },
          },
          { new: true }
        );
        await Transaction.findOneAndUpdate(
          { coin: confirmBuy._id },
          { confirmbuy: true, buycoin: true },
          { new: true }
        );
        // UserBid
        await User.findByIdAndUpdate(
          { _id: newTransaction.payer },
          {
            $inc: {
              moneyoutcoins: -newTransaction.amount,
              moneyincoins: newTransaction.amount,
            },
            $push: { totalcoins: confirmBuy._id },
          },
          { new: true }
        );
        // user
        await User.findByIdAndUpdate(
          { _id: newTransaction.payee },
          {
            $inc: {
              moneyoutcoins: newTransaction.amount,
              moneyincoins: -newTransaction.amount,
            },
            $pull: { totalcoins: confirmBuy._id },
          },
          { new: true }
        );
        expect(requestConfirmBuy.status).toEqual(200);
        expect(findAnWallet?.currentowner).toBe(newTransaction.payer);
        expect(findAnWallet?.hash).toBe(hashCoin);
        expect(newTransaction.confirmbuy).toBe(true);
        expect(UserBid.moneyoutcoins).toBe(90000);
        expect(UserBid.totalcoins).toHaveProperty('totalcoins', confirmBuy._id);
        expect(user.moneyoutcoins).toBe(110000);
        expect(user.totalcoins).toEqual(
          expect.not.stringContaining(confirmBuy._id)
        );
      } else if (confirmBuy.confirmbuy === false) {
        await Wallet.findByIdAndUpdate(
          { _id: confirmBuy._id },
          { avaibleforpurchase: false },
          { new: true }
        );
        await Transaction.findOneAndDelete({ coin: confirmBuy._id });

        expect(findAnWallet?.avaibleforpurchase).toBe(false);
      }
      expect(requestConfirmBuy.status).toEqual(200);
    }

    setTimeout(twostep, 5000);

    expect(bidRequest.status).toEqual(200);
    expect(myBidCoins.status).toEqual(200);

    // expect(findAnWallet.currentowner).toBe(newTransaction.payer)
    // expect(newTransaction.confirmbuy).toBe(true)
    // expect(UserBid.moneyoutcoins).toBe(90000)
    // expect(UserBid.totalcoins).toHaveProperty('totalcoins', confirmBuy._id)
    // expect(user.moneyoutcoins).toBe(110000)
    // expect(user.totalcoins).toEqual(expect.not.stringContaining(confirmBuy._id))
  });
});
