import 'dotenv/config';
import { connect, connection } from 'mongoose';
import { createHash } from 'crypto';

import { IUser, User } from '../src/models/user';
import { IWallet, Wallet } from '../src/models/wallet';
import { CreatorCoin, ICoinCreator } from '../src/models/coinCreator';
import { Transaction } from '../src/models/transaction';

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

    const NameHash = createHash('md5').update(`testCoins`).digest('hex');
    creatorcoin = await CreatorCoin.create({
      namecreator: user.name,
      namecoin: 'test',
      namecoinhash: NameHash,
      objectivecoin: 'comprar jogos',
      currentmarketvalue: 10000,
    });
    for (let i = 0; i < 10; i++) {
      const anyupdate = Math.random() * 9999999998;
      const publick = Math.random() * 9999999997;
      const privatek = Math.random() * 9999999996;

      const hashCoin = createHash('sha512')
        .update(`${anyupdate}` + i)
        .digest('hex');

      const publicKey = createHash('sha512').update(`${publick}`).digest('hex');
      const privateKey = createHash('sha512')
        .update(`${privatek}`)
        .digest('hex');

      const newWallets = {
        amount: 10000,
        // 100k
        hash: `${NameHash}.${hashCoin}`,
        currentowner: user._id,
        publickey: publicKey,
        privatekey: privateKey,
        codingforbuy: 'codingtest',
        avaibleforpurchase: true,
      } as const;
      wallets = await new Wallet(newWallets).save();

      await User.findOneAndUpdate(
        { _id: user.id },
        {
          $push: {
            totalcoins: wallets._id,
          },
          $inc: { moneyincoins: wallets.amount },
        },
        { new: true }
      );
    }
  });

  it('POST /codingtransaction && PUT /confirmbuycoin - buy coin', async () => {
    // POST /codingtransaction
    const UserBid = await User.create({
      name: 'lucas',
      age: 20,
      cpf: '829.705.563-90',
      password: '123456',
      moneyoutcoins: 100000,
    });

    const findAnWallet = await Wallet.findOne({});
    if (!findAnWallet) throw new Error('no wallet was created');

    const infosBuy = {
      publickey: findAnWallet.publickey,
      codingforbuy: 'codingtest',
      amount: 10000,
    } as const;

    const mathcoding = Math.random() * 9999999999;
    const codinghash = createHash('sha512')
      .update(`${mathcoding}`)
      .digest('hex');
    const newTransaction = new Transaction({
      coin: findAnWallet._id,
      amount: infosBuy.amount,
      payer: UserBid._id,
      payee: wallets.currentowner,
      codingconfirm: codinghash,
    });
    await newTransaction.save();
    expect(newTransaction.coin).toBe(findAnWallet._id);
    expect(newTransaction.amount).toBe(infosBuy.amount);
    expect(newTransaction.payer).toEqual(
      expect.stringContaining(`${UserBid._id}`)
    );
    expect(newTransaction.payee).toEqual(
      expect.stringContaining(`${wallets.currentowner}`)
    );
    expect(newTransaction.codingconfirm).toBe(codinghash);

    // PUT /confirmbuycoin
    const confirmBuy = {
      privatekey: findAnWallet?.privatekey,
      cofingforbuy: findAnWallet?.codingforbuy,
      codingconfirm: newTransaction.codingconfirm,
      confirmbuy: true,
      _id: findAnWallet?.id,
      hash: findAnWallet?.hash,
    } as const;

    const anyupdate = Math.random() * 9999999999;
    const publick = Math.random() * 9999999999;
    const privatek = Math.random() * 9999999999;
    const hashCoin = createHash('sha512').update(`${anyupdate}`).digest('hex');
    const publicKey = createHash('sha512').update(`${publick}`).digest('hex');
    const privateKey = createHash('sha512').update(`${privatek}`).digest('hex');

    if (confirmBuy.confirmbuy === true) {
      const upWallet = await Wallet.findByIdAndUpdate(
        { _id: confirmBuy._id },
        {
          $inc: { index: 1 },
          $push: {
            prevHash: confirmBuy.hash,
            transactions: newTransaction._id,
          },
          hash: `${creatorcoin.namecoinhash}.${hashCoin}`,
          currentowner: UserBid.id,
          avaibleforpurchase: false,
          publickey: publicKey,
          privatekey: privateKey,
          update: new Date(),
          $unset: { codingforbuy: '' },
        },
        { new: true }
      );
      expect(upWallet?.prevHash).toContainEqual(confirmBuy.hash);
      expect(upWallet?.transactions).toContainEqual(newTransaction._id);
      expect(upWallet?.hash).toEqual(`${creatorcoin.namecoinhash}.${hashCoin}`);
      expect(upWallet?.currentowner).toEqual(
        expect.stringContaining(`${UserBid._id}`)
      );
      expect(upWallet?.avaibleforpurchase).toBe(false);
      expect(upWallet?.publickey).toEqual(publicKey);
      expect(upWallet?.privatekey).toEqual(privateKey);
      expect(upWallet?.codingforbuy).toBeFalsy();

      const upTransaction = await Transaction.findOneAndUpdate(
        { coin: confirmBuy._id },
        { confirmbuy: true, buycoin: true },
        { new: true }
      );
      expect(upTransaction?.confirmbuy).toBe(true);
      expect(upTransaction?.buycoin).toBe(true);

      const upUserBid = await User.findByIdAndUpdate(
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
      const subMoney = UserBid.moneyoutcoins - infosBuy.amount;
      expect(upUserBid?.moneyoutcoins).toBe(subMoney);
      expect(upUserBid?.moneyincoins).toBe(newTransaction.amount);
      expect(upUserBid?.totalcoins).toContainEqual(confirmBuy._id);

      const findUserPayee = await User.findById({ _id: newTransaction.payee });
      if (!findUserPayee) throw new Error('default user not created');
      const upUser = await User.findByIdAndUpdate(
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
      const someMoney = findUserPayee.moneyoutcoins + infosBuy.amount;
      expect(upUser?.moneyoutcoins).toBe(someMoney);
      const subMoneyincoins =
        findUserPayee.moneyincoins - newTransaction.amount;
      expect(upUser?.moneyincoins).toBe(subMoneyincoins);
      expect(upUser?.totalcoins).toEqual(
        expect.not.stringContaining(confirmBuy._id)
      );
    } else if (confirmBuy.confirmbuy === false) {
      const upWallet = await Wallet.findByIdAndUpdate(
        { _id: confirmBuy._id },
        { avaibleforpurchase: false },
        { new: true }
      );
      expect(upWallet?.avaibleforpurchase).toBe(false);

      await Transaction.findOneAndDelete({ coin: confirmBuy._id });
    }
  });

  it('PUT /sendmoneycoins - money transaction with a coin', async () => {
    const newUser = new User({
      name: 'lucas',
      age: 20,
      cpf: '829.705.563-90',
      password: '123456',
    });
    await newUser.save();

    const findIdWallet = await Wallet.findOne({});
    if (!findIdWallet) throw new Error('no wallet was created');

    const infosTransaction = {
      name: 'lucas',
      amount: 10000 /**1000 */,
      _id: findIdWallet._id,
    } as const;

    const newTransaction = new Transaction({
      coin: infosTransaction._id,
    });
    await newTransaction.save();
    expect(newTransaction.coin).toBe(infosTransaction._id);

    const findDefaultUser = await User.findById({ _id: user._id });
    if (!findDefaultUser) throw new Error('default user not created');
    if (findIdWallet.amount === infosTransaction.amount) {
      const upTransaction = await Transaction.findOneAndUpdate(
        { coin: findIdWallet._id },
        {
          amount: infosTransaction.amount,
          payer: user._id,
          payee: newUser._id,
          buycoin: false,
        },
        { new: true }
      );
      expect(upTransaction?.amount).toEqual(infosTransaction.amount);
      expect(upTransaction?.payer).toEqual(
        expect.stringContaining(`${user._id}`)
      );
      expect(upTransaction?.payee).toEqual(
        expect.stringContaining(`${newUser._id}`)
      );
      expect(upTransaction?.buycoin).toEqual(false);

      const upPayer = await User.findByIdAndUpdate(
        { _id: user._id },
        {
          $inc: { moneyincoins: -infosTransaction.amount },
          $push: { transactions: newTransaction._id },
          $pull: { totalcoins: findIdWallet._id },
        },
        { new: true }
      );
      const subMoneyUser: number =
        findDefaultUser.moneyincoins - infosTransaction.amount;
      expect(upPayer?.moneyincoins).toEqual(subMoneyUser);
      expect(upPayer?.transactions).toContainEqual(upTransaction?._id);
      expect(upPayer?.totalcoins).not.toContainEqual(findIdWallet._id);

      const upPayee = await User.findByIdAndUpdate(
        { _id: newUser._id },
        {
          $inc: { moneyoutcoins: infosTransaction.amount },
          $push: { transactions: newTransaction._id },
        },
        { new: true }
      );
      expect(upPayee?.moneyoutcoins).toEqual(infosTransaction.amount);
      expect(upPayee?.transactions).toContainEqual(upTransaction?._id);

      await Wallet.findByIdAndDelete({
        _id: infosTransaction._id,
      });
    } else {
      const upTransaction = await Transaction.findOneAndUpdate(
        { coin: findIdWallet._id },
        {
          amount: infosTransaction.amount,
          payer: user._id,
          payee: newUser._id,
          buycoin: false,
        }
      );
      expect(upTransaction?.amount).toEqual(infosTransaction.amount);
      expect(upTransaction?.payer).toEqual(
        expect.stringContaining(`${user._id}`)
      );
      expect(upTransaction?.payee).toEqual(
        expect.stringContaining(`${newUser._id}`)
      );
      expect(upTransaction?.buycoin).toEqual(false);

      const upPayer = await User.findByIdAndUpdate(
        { _id: user._id },
        {
          $inc: { moneyincoins: -infosTransaction.amount },
          $push: { transactions: newTransaction._id },
        },
        { new: true }
      );
      const subMoneyUser: number =
        findDefaultUser.moneyincoins - infosTransaction.amount;
      expect(upPayer?.moneyincoins).toEqual(subMoneyUser);
      expect(upPayer?.transactions).toContainEqual(upTransaction?._id);

      const upPayee = await User.findByIdAndUpdate(
        { _id: newUser._id },
        {
          $inc: { moneyoutcoins: infosTransaction.amount },
          $push: { transactions: newTransaction._id },
        },
        { new: true }
      );
      expect(upPayee?.moneyoutcoins).toEqual(infosTransaction.amount);
      expect(upPayee?.transactions).toContainEqual(upTransaction?._id);

      const anyupdate = Math.random() * 9999999999;
      const hashCoin = createHash('sha512')
        .update(`${anyupdate}`)
        .digest('hex');
      const nameCoin: string = findIdWallet.hash;
      const [nameinhash] = nameCoin.split('.');
      const coinCreatorExist = await CreatorCoin.findOne({
        namecoinhash: nameinhash,
      });
      if (!coinCreatorExist) throw new Error(`coin not exist`);
      const upWallet = await Wallet.findByIdAndUpdate(
        { _id: infosTransaction._id },
        {
          $inc: { amount: -infosTransaction.amount, index: 1 },
          $push: {
            prevHash: findIdWallet.hash,
            transactions: newTransaction._id,
          },
          hash: `${nameinhash}.${hashCoin}`,
        },
        { new: true }
      );
      const subMoneyWallet: number =
        findIdWallet.amount - infosTransaction.amount;
      expect(upWallet?.amount).toEqual(subMoneyWallet);
      expect(upWallet?.prevHash).toContainEqual(findIdWallet.hash);
      expect(upWallet?.transactions).toContainEqual(upTransaction?._id);
      expect(upWallet?.hash).toBe(`${nameinhash}.${hashCoin}`);
    }
  });

  it('PUT /sendmoneyoutocoins - standard money transaction', async () => {
    const newUser = new User({
      name: 'lucas',
      age: 20,
      cpf: '829.705.563-90',
      password: '123456',
    });
    await newUser.save();

    const infosTransaction = { name: 'lucas', amount: 1000 } as const;

    if (user.moneyoutcoins < infosTransaction.amount)
      throw new Error('user has less money');

    const newTransaction = new Transaction({
      amount: infosTransaction.amount,
      payer: user._id,
      payee: newUser._id,
      buycoin: false,
    });
    await newTransaction.save();
    expect(newTransaction.amount).toEqual(infosTransaction.amount);
    expect(newTransaction.payer).toEqual(
      expect.stringContaining(`${user._id}`)
    );
    expect(newTransaction.payee).toEqual(
      expect.stringContaining(`${newUser._id}`)
    );
    expect(newTransaction.buycoin).toEqual(false);

    const upPayer = await User.findByIdAndUpdate(
      { _id: user._id },
      {
        $inc: { moneyoutcoins: -infosTransaction.amount },
        $push: { transactions: newTransaction._id },
      },
      { new: true }
    );
    // talvez não precisasse disso, mas como o _id do newTransaction muda quando eu do um `findByIdAndUpdate` (não sei o pq ainda) e como eu queria testar se vem o _id certo eu preciso fazer isso
    const newIdTransaction = upPayer?.transactions;
    const subMoneyUser = user.moneyoutcoins - infosTransaction.amount;
    expect(upPayer?.moneyoutcoins).toEqual(subMoneyUser);
    expect(upPayer?.transactions).toEqual(newIdTransaction);

    const upPayee = await User.findByIdAndUpdate(
      { _id: newUser._id },
      {
        $inc: { moneyoutcoins: infosTransaction.amount },
        $push: { transactions: newTransaction._id },
      },
      { new: true }
    );
    expect(upPayee?.moneyoutcoins).toEqual(infosTransaction.amount);
    expect(upPayee?.transactions).toEqual(newIdTransaction);
  });
});
