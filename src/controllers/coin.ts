import { Request, Response } from 'express';
import { createHash } from 'crypto';
import { HydratedDocument } from 'mongoose';

import { ITransaction, Transaction } from '../models/transaction';
import { IUser, User } from '../models/user';
import { ICoinCreator, CreatorCoin } from './../models/coinCreator';
import { IWallet, Wallet } from '../models/wallet';
import { Enterprise } from '../models/enterprise';
import {
  Appreciation,
  IApperciation,
} from '../models/appreciationOfTheCurrency';

import { AppError } from '../config/AppErrors';

type WT = {
  privatekey: string;
  codingforbuy: string;
  codingconfirm: string;
  confirmbuy: boolean;
  _id: string;
  hash: string;
};

type SendMoney = {
  name: string;
  amount: number;
  _id?: string;
};

export class CoinController {
  public async createCoinUser(req: Request, res: Response): Promise<object> {
    const { namecoin, objectivecoin }: ICoinCreator = req.body;

    const nameCoinExists: ICoinCreator = await CreatorCoin.findOne({ namecoin: namecoin });
    if (nameCoinExists) throw new AppError('name coin alredy exists');

    const NameHash = createHash('md5').update(`${namecoin}`).digest('hex');
    const valuecoin = Math.floor(Math.random() * 100000);

    const objcoin = await CreatorCoin.find({ objectivecoin: objectivecoin });

    if (objcoin.length > 2)
      throw new AppError(
        'there are already many coins created for the same purpose'
      );

    if (req.user.moneyoutcoins < 50000)
      throw new AppError("you don't have enough money to pay the fee");

    const newCoin: HydratedDocument<ICoinCreator> = new CreatorCoin({
      namecreator: req.user.name,
      namecoin,
      namecoinhash: NameHash,
      objectivecoin,
      currentmarketvalue: valuecoin,
      createdAt: new Date(),
    });

    await newCoin.save();

    const newAppreciation: HydratedDocument<IApperciation> = new Appreciation({
      coin: newCoin._id,
      nameHashCoin: newCoin.namecoinhash,
      prevValue: {
        value: newCoin.currentmarketvalue,
        dateUpdate: newCoin.createdAt,
      },
      currentvalue: newCoin.currentmarketvalue,
    });

    await newAppreciation.save();

    if (valuecoin > 50000) {
      const qat: number = Math.floor(Math.random() * 20) + 3;

      for (let i = 0; i < qat; i++) {
        const anyupdate = Math.random() * 9999999998;
        const publick = Math.random() * 9999999997;
        const privatek = Math.random() * 9999999996;

        const hashCoin = createHash('sha256').update(`${anyupdate}` + i);

        // const keypair = generateKeyPairSync('rsa', {
        //   modulusLength: 2048,
        //   publicKeyEncoding: { type: 'spki', format: 'pem' },
        //   privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
        // })

        const publicKey = createHash('sha256')
          .update(`${publick}`)
          .digest('hex');
        const privateKey = createHash('sha256')
          .update(`${privatek}`)
          .digest('hex');

        const newWallet: HydratedDocument<IWallet> = new Wallet({
          amount: valuecoin,
          hash: `${NameHash}.${hashCoin.digest('hex')}`,
          currentowner: req.user.id,
          publickey: publicKey,
          privatekey: privateKey,
        });

        await newWallet.save();

        await User.findByIdAndUpdate(
          { _id: req.user.id },
          {
            $push: {
              totalcoins: { coinid: newWallet._id, namehash: NameHash },
            },
            $inc: { moneyincoins: newWallet.amount },
          },
          { new: true }
        );
      }
    } else if (valuecoin > 20000) {
      const qat: number = Math.floor(Math.random() * 40) + 15;

      for (let i = 0; i < qat; i++) {
        const anyupdate = Math.random() * 9999999998;
        const publick = Math.random() * 9999999997;
        const privatek = Math.random() * 9999999996;

        const hashCoin = createHash('sha256').update(`${anyupdate}` + i);

        // const keypair = generateKeyPairSync('rsa', {
        //   modulusLength: 2048,
        //   publicKeyEncoding: { type: 'spki', format: 'pem' },
        //   privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
        // })

        const publicKey = createHash('sha256')
          .update(`${publick}`)
          .digest('hex');
        const privateKey = createHash('sha256')
          .update(`${privatek}`)
          .digest('hex');

        const newWallet: HydratedDocument<IWallet> = new Wallet({
          amount: valuecoin,
          hash: `${NameHash}.${hashCoin.digest('hex')}`,
          currentowner: req.user.id,
          publickey: publicKey,
          privatekey: privateKey,
        });
        await newWallet.save();

        await User.findByIdAndUpdate(
          { _id: req.user.id },
          {
            $push: {
              totalcoins: { coinid: newWallet._id, namehash: NameHash },
            },
            $inc: { moneyincoins: newWallet.amount },
          },
          { new: true }
        );
      }
    } else if (valuecoin > 7500) {
      const qat: number = Math.floor(Math.random() * 80) + 30;

      for (let i = 0; i < qat; i++) {
        const anyupdate = Math.random() * 9999999998;
        const publick = Math.random() * 9999999997;
        const privatek = Math.random() * 9999999996;

        const hashCoin = createHash('sha256').update(`${anyupdate}` + i);

        // const keypair = generateKeyPairSync('rsa', {
        //   modulusLength: 2048,
        //   publicKeyEncoding: { type: 'spki', format: 'pem' },
        //   privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
        // })

        const publicKey = createHash('sha256')
          .update(`${publick}`)
          .digest('hex');
        const privateKey = createHash('sha256')
          .update(`${privatek}`)
          .digest('hex');

        const newWallet: HydratedDocument<IWallet> = new Wallet({
          amount: valuecoin,
          hash: `${NameHash}.${hashCoin.digest('hex')}`,
          currentowner: req.user.id,
          publickey: publicKey,
          privatekey: privateKey,
        });
        await newWallet.save();

        await User.findByIdAndUpdate(
          { _id: req.user.id },
          {
            $push: {
              totalcoins: { coinid: newWallet._id, namehash: NameHash },
            },
            $inc: { moneyincoins: newWallet.amount },
          },
          { new: true }
        );
      }
    } else {
      const qat: number = Math.floor(Math.random() * 130) + 60;

      for (let i = 0; i < qat; i++) {
        const anyupdate = Math.random() * 9999999998;
        const publick = Math.random() * 9999999997;
        const privatek = Math.random() * 9999999996;

        const hashCoin = createHash('sha256').update(`${anyupdate}` + i);

        // const keypair = generateKeyPairSync('rsa', {
        //   modulusLength: 2048,
        //   publicKeyEncoding: { type: 'spki', format: 'pem' },
        //   privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
        // })

        const publicKey = createHash('sha256')
          .update(`${publick}`)
          .digest('hex');
        const privateKey = createHash('sha256')
          .update(`${privatek}`)
          .digest('hex');

        const newWallet: HydratedDocument<IWallet> = new Wallet({
          amount: valuecoin,
          hash: `${NameHash}.${hashCoin.digest('hex')}`,
          currentowner: req.user.id,
          publickey: publicKey,
          privatekey: privateKey,
        });
        await newWallet.save();

        await User.findByIdAndUpdate(
          { _id: req.user.id },
          {
            $push: {
              totalcoins: { coinid: newWallet._id, namehash: NameHash },
            },
            $inc: { moneyincoins: newWallet.amount },
          },
          { new: true }
        );
      }
    }

    return res.status(200).json({ msg: 'create coin success', newCoin });
  }
  public async myCoinAvaibleForPurchase(req: Request, res: Response): Promise<object> {
    const { _id, codingforbuy, privatekey }: IWallet = req.body;

    const coinExist: IWallet = await Wallet.findOne({
      _id: _id,
      currentowner: req.user.id
    });

    if (!coinExist) throw new AppError('coin not exists');

    if (coinExist.avaibleforpurchase === false)
      throw new AppError('This coin is not available to the market, put it up for sale, please.');

    if (coinExist.privatekey !== privatekey)
      throw new AppError('private key incorrect, or private key not exists');

    if (coinExist.codingforbuy === codingforbuy)
      throw new AppError('coding for buy exists');

    const hashCodingForBuy = createHash('md5')
      .update(`${codingforbuy}`)
      .digest('hex');

    const newAFP = await Wallet.findByIdAndUpdate(
      { _id: _id },
      { avaibleforpurchase: true, codingforbuy: hashCodingForBuy },
      { new: true }
    );

    return res.status(200).json({newAFP});
  }
  public async searchCoinForPurchase(req: Request, res: Response): Promise<object> {
    const allcoins: Array<IWallet> = await Wallet.find({ avaibleforpurchase: true }).select(
      '-prevHash -currentowner -transactions -privatekey'
    );

    if (!allcoins)
      throw new AppError("looks like it doesn't have any currency available");

    return res.status(200).json({allcoins});
  }
  public async bidCoin(req: Request, res: Response): Promise<object> {
    const { publickey, codingforbuy, amount }: IWallet = req.body;

    const coinExists: IWallet = await Wallet.findOne({ publickey: publickey });

    if (!coinExists) throw new AppError('coin not found', 404);

    if (coinExists.codingforbuy !== codingforbuy)
      throw new AppError('coding for buy not found', 404);

    if (coinExists.amount > req.user.moneyoutcoins)
      throw new AppError('small money');

    const mathcoding = Math.random() * 9999999999;
    const codinghash = createHash('sha256')
      .update(`${mathcoding}`)
      .digest('hex');

    const newTransaction: HydratedDocument<ITransaction> = new Transaction({
      coin: coinExists._id,
      amount,
      payer: req.user.id,
      payee: coinExists.currentowner,
      codingconfirm: codinghash,
    });

    await newTransaction.save();

    return res
      .status(200)
      .json({ msg: 'Transaction in progress', newTransaction });
  }
  public async seeBidsOnMyCurrency(req: Request, res: Response): Promise<object> {
    const coins: Array<ITransaction> = await Transaction.find({ payee: req.user.id });

    return res.status(200).json({ coins });
  }
  public async confirmBuyCoin(req: Request, res: Response): Promise<object> {
    const {
      privatekey,
      codingforbuy,
      codingconfirm,
      confirmbuy,
      _id,
      hash,
    }: WT = req.body;

    const coinExists: IWallet = await Wallet.findOne({
      privatekey: privatekey,
      currentowner: req.user.id
    });

    if (!coinExists) throw new AppError('private key not found', 404);

    if (coinExists.hash !== hash) throw new AppError('hash not found', 404);

    if (!codingforbuy) throw new AppError('please put the confirmforbuy');

    if (coinExists.codingforbuy !== codingforbuy)
      throw new AppError('coding for buy not found', 404);

    const transactionExists = await Transaction.findOne({
      codingconfirm: codingconfirm,
    });

    if (!transactionExists) throw new AppError('codingconfirm not found', 404);

    if (transactionExists.confirmbuy === true)
      throw new AppError('currency has already been traded');

    if (!confirmbuy) throw new AppError('please put a confirmbuy');

    const anyupdate = Math.random() * 9999999997;
    const publick = Math.random() * 9999999998;
    const privatek = Math.random() * 9999999991;

    const hashCoin = createHash('sha256').update(`${anyupdate}`).digest('hex');
    const publicKey = createHash('sha256').update(`${publick}`).digest('hex');
    const privateKey = createHash('sha256').update(`${privatek}`).digest('hex');

    if (confirmbuy === true) {
      const nameCoin: string = hash;
      const [nameinhash, others]: Array<string> = nameCoin.split('.');
      const coinCreatorExist: ICoinCreator = await CreatorCoin.findOne({
        namecoinhash: nameinhash,
      });

      if (!coinCreatorExist) throw new AppError(`coin not exist`);

      const newWallet: HydratedDocument<IWallet> = await Wallet.findByIdAndUpdate(
        { _id: _id },
        {
          $inc: { index: 1 },
          $push: { prevHash: hash, transactions: transactionExists._id },
          hash: `${nameinhash}.${hashCoin}`,
          currentowner: transactionExists.payer,
          avaibleforpurchase: false,
          publickey: publicKey,
          privatekey: privateKey,
          updatedAt: new Date(),
          $unset: { codingforbuy: '' },
        },
        { new: true }
      );
      const newTransaction: HydratedDocument<ITransaction> = await Transaction.findOneAndUpdate(
        { coin: _id },
        { confirmbuy: true, buycoin: true },
        { new: true }
      );
      const UpdatePayer = await User.findByIdAndUpdate(
        { _id: transactionExists.payer },
        {
          $inc: {
            moneyoutcoins: -transactionExists.amount,
            moneyincoins: transactionExists.amount,
          },
          $push: { totalcoins: { coinid: _id, namehash: nameinhash } },
        },
        { new: true }
      );
      const UpdatePayee = await User.findByIdAndUpdate(
        { _id: coinExists.currentowner },
        {
          $inc: {
            moneyoutcoins: transactionExists.amount,
            moneyincoins: -transactionExists.amount,
          },
          $pull: { totalcoins: { coinid: _id, namehash: nameinhash } },
        },
        { new: true }
      );

      await Appreciation.findOneAndUpdate(
        { nameHashCoin: nameinhash },
        { $inc: { totalcoinspurchase: 1 } }
      );

      return res.status(200).json({
        msg: 'transaction complete',
        newBlockchain: newWallet,
        newBlockTransaction: newTransaction,
        newProfilePayer: UpdatePayer,
        newProfilePayee: UpdatePayee,
      });
    } else if (confirmbuy === false) {
      const updateWallet = await Wallet.findByIdAndUpdate(
        { _id: _id },
        { avaibleforpurchase: false },
        { new: true }
      );
      const updateTransaction = await Transaction.findOneAndDelete({
        coin: _id,
      });
      return res.status(200).json({
        msg: 'no transactions were made',
        newBlock: updateWallet,
        newTransaction: updateTransaction,
      });
    }
  }
  public async sendMoneyWithMoneyTheCoins(req: Request, res: Response): Promise<object> {
    const { name, amount, _id }: SendMoney = req.body;

    const payeeExists: IUser = await User.findOne({ name: name });

    if (!payeeExists) throw new AppError('payee not found', 404);

    const walletransactionExists: IWallet = await Wallet.findById({ _id: _id });

    if (!walletransactionExists) throw new AppError('coin not found', 404);

    if (walletransactionExists.amount < amount)
      throw new AppError(
        "there's more money you actually have in the currency"
      );

    const transactionExists: ITransaction = await Transaction.findOne({ coin: _id });

    if (!transactionExists) throw new AppError('transaction not found', 404);

    const anyupdate = Math.random() * 9999999999;

    const hashCoin = createHash('sha256').update(`${anyupdate}`).digest('hex');

    const updatePayer = await User.findByIdAndUpdate(
      { _id: req.user.id },
      { $inc: { moneyincoins: -amount } },
      { new: true }
    );

    const updatePayee = await User.findByIdAndUpdate(
      { _id: payeeExists._id },
      { $inc: { moneyoutcoins: amount } },
      { new: true }
    );

    const nameCoin: string = walletransactionExists.hash;
    const [nameinhash] = nameCoin.split('.');
    const coinCreatorExist = await CreatorCoin.findOne({
      namecoinhash: nameinhash,
    });

    if (!coinCreatorExist) throw new AppError(`coin not exist`);

    const coinpayer = await Wallet.findByIdAndUpdate(
      { _id: _id },
      {
        $inc: { amount: -amount, index: 1 },
        $push: {
          prevHash: walletransactionExists.hash,
          transactions: transactionExists._id,
        },
        hash: `${nameinhash}.${hashCoin}`,
      },
      { new: true }
    );

    const updateTransaction = await Transaction.findOneAndUpdate(
      { coin: _id },
      {
        coin: _id,
        amount: amount,
        payer: req.user.id,
        payee: payeeExists._id,
        buycoin: false,
      },
      { new: true }
    );
    return res.status(200).json({
      msg: 'money sent',
      updatePayer,
      updatePayee,
      coinpayer,
      updateTransaction,
    });
  }
  public async sendMoneyWithMoneyOutCoins(req: Request, res: Response): Promise<object> {
    const { name, amount }: SendMoney = req.body;

    const payeeExists: IUser = await User.findOne({ name: name });

    if (!payeeExists) throw new AppError('payee not found', 404);

    if (req.user.moneyoutcoins < amount)
      throw new AppError("there's more money there that you really have");

    const newTransaction: HydratedDocument<ITransaction> = new Transaction({
      amount,
      payer: req.user.id,
      payee: payeeExists._id,
      buycoin: false,
    });

    await newTransaction.save();

    const updatePayer = await User.findByIdAndUpdate(
      { _id: req.user.id },
      {
        $inc: { moneyoutcoins: -amount },
        $push: { transactions: newTransaction._id },
      },
      { new: true }
    );

    const updatePayee = await User.findByIdAndUpdate(
      { _id: payeeExists._id },
      {
        $inc: { moneyoutcoins: amount },
        $push: { transactions: newTransaction._id },
      },
      { new: true }
    );

    return res.status(200).json({
      msg: 'money sent',
      updatePayer,
      updatePayee,
      newTransaction,
    });
  }
  public async createCoinEnterprise(req: Request, res: Response): Promise<object> {
    const { namecoin, objectivecoin }: ICoinCreator = req.body;

    const nameCoinExists = await CreatorCoin.findOne({
      namecoin: namecoin,
    });

    if (nameCoinExists) throw new AppError('name Coin alredy exist');

    const nameHash = createHash('md5').update(`${namecoin}`).digest('hex');

    const objcoin = await CreatorCoin.find({ objectivecoin: objectivecoin });

    if (objcoin.length > 2)
      throw new AppError(
        'there are already many coins created for the same purpose'
      );

    if (req.enterprise.moneyoutcoins < 100000)
      throw new AppError(
        "your company doesn't have enough money to pay the fee"
      );

    const newCoin: HydratedDocument<ICoinCreator> = new CreatorCoin({
      namecreator: req.enterprise.name,
      namecoin,
      namecoinhash: nameHash,
      objectivecoin,
      currentmarketvalue: 2000,
    });

    await newCoin.save();

    for (let i = 0; i < 90; i++) {
      const anyupdate = Math.random() * 99999999958;
      const publick = Math.random() * 9999999997;
      const privatek = Math.random() * 9999999996;

      const hashCoin = createHash('sha256').update(`${anyupdate}` + i);

      // const keypair = generateKeyPairSync('rsa', {
      //   modulusLength: 2048,
      //   publicKeyEncoding: { type: 'spki', format: 'pem' },
      //   privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
      // })

      const publicKey = createHash('sha256').update(`${publick}`).digest('hex');
      const privateKey = createHash('sha256')
        .update(`${privatek}`)
        .digest('hex');

      const newWallet: HydratedDocument<IWallet> = new Wallet({
        amount: 2000,
        hash: `${nameHash}.${hashCoin.digest('hex')}`,
        currentowner: req.enterprise.id,
        publickey: publicKey,
        privatekey: privateKey,
      });

      await newWallet.save();

      await Enterprise.findByIdAndUpdate(
        { _id: req.enterprise._id },
        {
          $push: { coins: newWallet._id },
          $inc: { moneyoutcoins: -100000, moneyincoins: newWallet.amount },
        }
      );
    }

    return res.status(201).json({ msg: 'create coin success', newCoin });
  }
}
