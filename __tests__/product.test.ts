import 'dotenv/config';
import { app } from '../src/app';
import request from 'supertest';
import { connect, connection } from 'mongoose';
import { createHash } from 'crypto';

import { IUser, User } from '../src/models/user';
import { IWallet, Wallet } from '../src/models/wallet';
import { CreatorCoin } from '../src/models/coinCreator';
import { Transaction } from '../src/models/transaction';
import { Enterprise, IEnterprise } from '../src/models/enterprise';
import { IProduct, Product } from '../src/models/product';
import { generateTokenForTests } from '../src/middleware/auth';

let enterprise: IEnterprise;
let tokenEnterprise: string;
let user: IUser;
let userOwnerWallet: IUser;
let tokenUserWallet: string;
let walletDefault: IWallet;

describe('Product controller', () => {
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
    await Transaction.deleteMany({});
    await Enterprise.deleteMany({});
    await Product.deleteMany({});

    user = await User.create({
      name: 'joao',
      age: 20,
      cpf: '829.705.890-52',
      password: '123456',
      moneyoutcoins: 100000,
    });
    enterprise = await Enterprise.create({
      name: 'enterprise',
      owners: user._id,
      cnpj: '63.055.076/1000-80',
      email: 'test@email.com',
      password: '123456',
      moneyoutcoins: 100000,
    });
    tokenEnterprise = generateTokenForTests(enterprise.toJSON());

    const NameHash = createHash('md5').update(`testProduct`).digest('hex');
    await CreatorCoin.create({
      namecreator: enterprise.name,
      namecoin: 'test',
      namecoinhash: NameHash,
      objectivecoin: 'comprar jogos' /* qualquer outro */,
      currentmarketvalue: 10000,
    });

    const newProduct = new Product({
      enterprise: enterprise._id,
      name: 'test name product',
      description: 'test description product',
      objective: 'comprar jogos',
      value: 1000,
    });
    await newProduct.save();

    userOwnerWallet = await User.create({
      name: 'lucas',
      age: 20,
      cpf: '586.965.890-82',
      password: '123456',
      moneyoutcoins: 10000,
      moneyincoins: 1001,
    });
    tokenUserWallet = generateTokenForTests(userOwnerWallet.toJSON());

    const anyupdate = Math.random() * 9999999998;
    const publick = Math.random() * 9999999997;
    const privatek = Math.random() * 9999999996;
    const hashCoin = createHash('sha256').update(`${anyupdate}`).digest('hex');
    const publicKey = createHash('sha256').update(`${publick}`).digest('hex');
    const privateKey = createHash('sha256').update(`${privatek}`).digest('hex');
    walletDefault = await Wallet.create({
      amount: 1000 /**1001 */ /**1000 */,
      hash: `${NameHash}.${hashCoin}`,
      currentowner: userOwnerWallet._id,
      publickey: publicKey,
      privatekey: privateKey,
      codingforbuy: 'codingtest',
    });
  });

  it('POST /registernewproduct - new products', async () => {
    const infosCreateProduct = {
      name: 'product test',
      description: 'description test',
      objective: 'comprar jogos' /**qualquer outro */,
      value: 100,
      quantity: 5,
    } as const;

    const newProductReq = await request(app)
      .post('/registernewproduct')
      .auth(tokenEnterprise, { type: 'bearer' })
      .send(infosCreateProduct);

    const objCoin = await CreatorCoin.findOne({
      objectivecoin: infosCreateProduct.objective,
    });

    if (!objCoin) throw new Error('There is no currency for that same purpose');

    if (enterprise.moneyoutcoins < infosCreateProduct.value * 10)
      throw new Error('insufficient money');

    for (let i = 0; i < infosCreateProduct.quantity; i++) {
      const newProduct = new Product({
        enterprise: enterprise._id,
        name: infosCreateProduct.name,
        description: infosCreateProduct.description,
        objective: infosCreateProduct.objective,
        value: infosCreateProduct.value,
      });
      await newProduct.save();
      expect(newProduct.enterprise).toBe(enterprise._id);
      expect(newProduct.name).toBe(infosCreateProduct.name);
      expect(newProduct.description).toBe(infosCreateProduct.description);
      expect(newProduct.objective).toBe(infosCreateProduct.objective);
      expect(newProduct.value).toBe(infosCreateProduct.value);

      const upEnterprise = await Enterprise.findByIdAndUpdate(
        { _id: enterprise._id },
        {
          $inc: { moneyoutcoins: (-newProduct.value * 38) / 100 },
          $push: {
            products: { name: newProduct.name, product: newProduct._id },
          },
        }
      );

      expect(newProduct.enterprise).toEqual(enterprise._id);
      expect(newProduct.name).toEqual(infosCreateProduct.name);
      expect(newProduct.description).toEqual(infosCreateProduct.description);
      expect(newProduct.objective).toEqual(infosCreateProduct.objective);
      expect(newProduct.value).toEqual(infosCreateProduct.value);

      expect(upEnterprise?.products).toBeTruthy();
    }

    expect(newProductReq.status).toEqual(201);
  });

  it('PUT /buyproduct - buy product', async () => {
    const findProduct = await Product.findOne({});
    if (!findProduct) throw new Error('uncreated product');

    const findWallet = await Wallet.findOne({
      hash: walletDefault.hash,
      currentowner: userOwnerWallet._id,
    });
    if (!findWallet) throw new Error('wallet not created');

    const infosBuy = {
      hash: findWallet.hash,
      _id: findProduct._id,
      amount: 1000 /*1001 */ /**999 */ /**1000 */,
    } as const;

    const nameCoin: string = findWallet.hash;
    const [nameinhash, hashcoin] = nameCoin.split('.');
    const coinCreatorExist = await CreatorCoin.findOne({
      namecoinhash: nameinhash,
    });
    if (!coinCreatorExist) throw new Error('coin not exist');

    if (coinCreatorExist.objectivecoin !== findProduct.objective)
      throw new Error(
        'you have not been able to buy this product with this coin, the objectives are different'
      );

    if (
      findWallet.amount < findProduct.value ||
      infosBuy.amount !== findProduct.value
    ) {
      throw new Error(
        'something in the payment is not right. The currency is with less money than the value of the product or money in req.body is wrong'
      );
    } else if (findWallet.amount === findProduct.value) {
      const newTransaction = await Transaction.create({
        product: infosBuy._id,
        coin: findWallet._id,
        amount: infosBuy.amount,
        payer: userOwnerWallet._id,
        payee: findProduct.enterprise,
        buycoin: false,
      });
      expect(newTransaction.product).toEqual(findProduct._id);
      expect(newTransaction.coin).toEqual(findWallet._id);
      expect(newTransaction.amount).toEqual(findProduct.value);
      expect(newTransaction.payer).toEqual(
        expect.stringContaining(`${userOwnerWallet._id}`)
      );
      expect(newTransaction.payee).toEqual(
        expect.stringContaining(`${enterprise._id}`)
      );
      expect(newTransaction.buycoin).toEqual(false);

      await Wallet.findOneAndDelete(
        {
          _id: findWallet._id,
        },
        { new: true }
      );

      const upUser = await User.findByIdAndUpdate(
        { _id: userOwnerWallet._id },
        {
          $inc: { moneyincoins: -findProduct.value },
          $pull: {
            totalcoins: findWallet._id,
          },
          $push: { products: infosBuy._id, transactions: newTransaction._id },
        },
        { new: true }
      );
      expect(upUser?.moneyincoins).toEqual(1);
      expect(upUser?.totalcoins).toEqual(expect.arrayContaining([]));
      expect(upUser?.products).toContainEqual(findProduct._id);
      expect(upUser?.transactions).toContainEqual(newTransaction._id);
      const upEnterprise = await Enterprise.findOneAndUpdate(
        { _id: findProduct.enterprise },
        {
          $inc: { moneyoutcoins: infosBuy.amount },
          $push: { transactions: newTransaction._id },
          $pull: {
            products: { name: findProduct.name, product: infosBuy._id },
          },
        },
        { new: true }
      );
      const sumMoneyoutcoins = enterprise.moneyoutcoins + findProduct.value;
      expect(upEnterprise?.moneyoutcoins).toEqual(sumMoneyoutcoins);
      expect(upEnterprise?.transactions).toContainEqual(newTransaction._id);
      expect(upEnterprise?.products).toEqual(expect.arrayContaining([]));

      const upProduct = await Product.findByIdAndUpdate(
        { _id: infosBuy._id },
        {
          proprietor: userOwnerWallet._id,
          sold: true,
        },
        { new: true }
      );
      expect(upProduct?.proprietor).toEqual(userOwnerWallet._id);
      expect(upProduct?.sold).toEqual(true);
    } else if (findWallet.amount > findProduct.value) {
      const newTransaction = await Transaction.create({
        product: infosBuy._id,
        coin: findWallet._id,
        amount: findProduct.value,
        payer: userOwnerWallet._id,
        payee: enterprise._id,
        buycoin: false,
      });
      expect(newTransaction.product).toEqual(findProduct._id);
      expect(newTransaction.coin).toEqual(findWallet._id);
      expect(newTransaction.amount).toEqual(findProduct.value);
      expect(newTransaction.payer).toEqual(
        expect.stringContaining(`${userOwnerWallet._id}`)
      );
      expect(newTransaction.payee).toEqual(
        expect.stringContaining(`${enterprise._id}`)
      );
      expect(newTransaction.buycoin).toEqual(false);

      const upUser = await User.findByIdAndUpdate(
        { _id: userOwnerWallet._id },
        {
          $inc: { moneyincoins: -findProduct.value },
          $push: { products: infosBuy._id, transactions: newTransaction._id },
        },
        { new: true }
      );
      const lessMoneyincoins = userOwnerWallet.moneyincoins - findProduct.value;
      expect(upUser?.moneyincoins).toEqual(lessMoneyincoins);
      expect(upUser?.products).toContainEqual(findProduct._id);
      expect(upUser?.transactions).toContainEqual(newTransaction._id);

      const upEnterprise = await Enterprise.findOneAndUpdate(
        { _id: findProduct.enterprise },
        {
          $inc: { moneyoutcoins: findProduct.value },
          $pull: {
            products: { name: findProduct.name, product: infosBuy._id },
          },
        },
        { new: true }
      );
      const sumMoneyEnterprise = enterprise.moneyoutcoins + infosBuy.amount;
      expect(upEnterprise?.moneyoutcoins).toEqual(sumMoneyEnterprise);
      expect(upEnterprise?.products).toEqual(expect.arrayContaining([]));

      const upProduct = await Product.findByIdAndUpdate(
        { _id: infosBuy._id },
        {
          proprietor: userOwnerWallet._id,
          sold: true,
        },
        { new: true }
      );
      expect(upProduct?.proprietor).toEqual(userOwnerWallet._id);
      expect(upProduct?.sold).toEqual(true);

      const anyupdate = Math.random() * 9999999997;
      const publick = Math.random() * 9999999998;
      const privatek = Math.random() * 9999999991;
      const hashCoin = createHash('sha256')
        .update(`${anyupdate}`)
        .digest('hex');
      const publicKey = createHash('sha256').update(`${publick}`).digest('hex');
      const privateKey = createHash('sha256')
        .update(`${privatek}`)
        .digest('hex');
      const upWallet = await Wallet.findOneAndUpdate(
        { hash: infosBuy.hash },
        {
          $inc: { index: 1, amount: -findProduct.value },
          $push: { prevHash: infosBuy.hash, transactions: newTransaction._id },
          hash: `${nameinhash}.${hashCoin}`,
          publickey: publicKey,
          privatekey: privateKey,
          updatedAt: new Date(),
        },
        { new: true }
      );
      const lessAmountWallet = findWallet.amount - findProduct.value;
      expect(upWallet?.amount).toEqual(lessAmountWallet);
      expect(upWallet?.prevHash).toContainEqual(infosBuy.hash);
      expect(upWallet?.transactions).toContainEqual(newTransaction._id);
      expect(upWallet?.publickey).toBe(publicKey);
      expect(upWallet?.privatekey).toBe(privateKey);
    }
  });
});
