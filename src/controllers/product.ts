import { Request, Response } from 'express';
import { IProduct, Product } from './../models/product';
import { CreatorCoin } from '../models/coinCreator';
import { Enterprise } from '../models/enterprise';

import { AppError } from '../config/AppErrors';
import { IWallet, Wallet } from '../models/wallet';
import { Transaction } from '../models/transaction';
import { createHash } from 'crypto';
import { User } from '../models/anyuser';

export class ProductController {
  public async createProduct(req: Request, res: Response) {
    const { name, description, objective, value, quantity }: IProduct =
      req.body;

    const productExists = await Product.find({ objective: objective });

    if (productExists.length > 2)
      throw new AppError('there are already many products with that same goal');

    if (quantity > 10)
      throw new AppError('has a lot of quantity, no one will buy so much not');

    const objCoin = await CreatorCoin.findOne({ objectivecoin: objective });

    if (!objCoin)
      throw new AppError('There is no currency for that same purpose');

    const enterprise = await Enterprise.findOne({
      enterprise: req.enterprise.id,
    });

    if (!enterprise) throw new AppError('enterprise not exist');

    if (enterprise.moneyoutcoins < value * 10)
      throw new AppError('insufficient money');

    for (let i = 0; i < quantity; i++) {
      const newProduct = new Product({
        enterprise: req.enterprise.id,
        name,
        description,
        objective,
        value,
      });

      await newProduct.save();

      await Enterprise.findByIdAndUpdate(
        { _id: req.enterprise.id },
        {
          $inc: { moneyoutcoins: (-newProduct.value * 38) / 100 },
          $push: {
            products: { name: newProduct.name, product: newProduct._id },
          },
        },
        { new: true }
      );
    }

    return res.status(200).json({ msg: 'deu certo, confia' });
  }
  public async searchProducts(req: Request, res: Response) {
    const products = await Product.find({
      objective: req.body.objective,
      sold: false,
    }).select('-_id -sold -__v -createdAt -updatedAt');

    if (!products) throw new AppError('product not exist');

    return res.status(200).json(products);
  }
  public async buyProduct(req: Request, res: Response) {
    const { hash, _id, amount }: IWallet = req.body;

    const coinExist = await Wallet.findOne({
      hash: hash,
      currentowner: req.user.id,
    });

    if (!coinExist)
      throw new AppError("this coin doesn't exist or she's not yours");

    const productExist = await Product.findOne({ _id: _id });

    if (!productExist || productExist.sold === true)
      throw new AppError('product not found', 404);

    if (coinExist.avaibleforpurchase === true)
      throw new AppError('this currency is available on the market');

    const nameCoin: string = hash;
    const [nameinhash, hashcoin] = nameCoin.split('.');
    const coinCreatorExist = await CreatorCoin.findOne({
      namecoinhash: nameinhash,
    });

    if (!coinCreatorExist) throw new AppError(`coin not exist`);

    if (coinCreatorExist.objectivecoin !== productExist.objective)
      throw new AppError(
        'you have not been able to buy this product with this coin, the objectives are different'
      );

    if (
      coinExist.amount < productExist.value ||
      amount !== productExist.value
    ) {
      throw new AppError(
        'something in the payment is not right. The currency is with less money than the value of the product or money in req.body is wrong.'
      );
    } else if (coinExist.amount === productExist.value) {
      const newTransaction = new Transaction({
        product: _id,
        coin: coinExist._id,
        amount: amount,
        payer: req.user.id,
        payee: productExist.enterprise,
        buycoin: false,
      });
      await newTransaction.save();

      const deleteWallet = await Wallet.findOneAndDelete(
        { _id: coinExist._id },
        { new: true }
      );

      const upUser = await User.findByIdAndUpdate(
        { _id: req.user.id },
        {
          $inc: { moneyincoins: -amount },
          $pull: { totalcoins: coinExist._id },
          $push: { products: _id, transactions: newTransaction._id },
        },
        { new: true }
      );

      const upEnterprise = await Enterprise.findOneAndUpdate(
        { _id: productExist.enterprise },
        {
          $inc: { moneyoutcoins: amount },
          $push: { transactions: newTransaction._id },
          $pull: { products: { name: productExist.name, product: _id } },
        },
        { new: true }
      );

      const upProduct = await Product.findByIdAndUpdate(
        { _id: _id },
        {
          proprietor: req.user.id,
          sold: true,
        },
        { new: true }
      );

      return res.status(200).json({
        msg: 'buy confirmed',
        newTransaction,
        deleteWallet,
        upUser,
        upEnterprise,
        upProduct,
      });
    } else if (coinExist.amount > productExist.value) {
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

      const newTransaction = new Transaction({
        product: _id,
        amount: amount,
        payer: req.user.id,
        payee: productExist.enterprise,
        buycoin: false,
      });
      await newTransaction.save();

      const upWallet = await Wallet.findOneAndUpdate(
        { hash: hash },
        {
          $inc: { index: 1, amount: -amount },
          $push: { prevHash: hash, transactions: newTransaction._id },
          hash: hashCoin,
          publickey: publicKey,
          privatekey: privateKey,
          updatedAt: new Date(),
        },
        { new: true }
      );

      const upUser = await User.findByIdAndUpdate(
        { _id: req.user.id },
        {
          $inc: { moneyincoins: -amount },
          $push: { products: _id, transactions: newTransaction._id },
        },
        { new: true }
      );

      const upEnterprise = await Enterprise.findOneAndUpdate(
        { _id: productExist.enterprise },
        {
          $inc: { moneyoutcoins: amount },
          $pull: { products: { name: productExist.name, product: _id } },
        },
        { new: true }
      );

      const upProduct = await Product.findByIdAndUpdate(
        { _id: _id },
        {
          proprietor: req.user.id,
          sold: true,
        },
        { new: true }
      );

      return res.status(200).json({
        msg: 'buy confirmed',
        newTransaction,
        upWallet,
        upUser,
        upEnterprise,
        upProduct,
      });
    }
  }
  public async deleteProduct(req: Request, res: Response) {
    const product = await Product.findOneAndDelete({
      _id: req.body._id,
      enterprise: req.enterprise.id,
      sold: false,
    });

    if (!product) throw new AppError('product not found');

    return res.status(200).json({ msg: 'product deleted' });
  }
}
