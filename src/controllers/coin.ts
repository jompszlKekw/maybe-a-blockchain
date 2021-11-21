import { Request, Response } from 'express';
import { ICoinCreator, CreatorCoin } from './../models/coinCreator';
import { IWallet, Wallet } from '../models/wallet';

import { AppError } from '../config/AppErrors';

import { createHash } from 'crypto';
import { Transaction } from '../models/transaction';
import { User } from '../models/anyuser';

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
  public async createCoin(req: Request, res: Response) {
    const { namecoin, objectivecoin }: ICoinCreator = req.body;

    const nameCoinExists = await CreatorCoin.findOne({ namecoin });
    if (nameCoinExists) throw new AppError('User alredy exists');

    const NameHash = createHash('md5').update(`${namecoin}`).digest('hex');
    const valuecoin = Math.floor(Math.random() * 100000);

    const objcoin = await CreatorCoin.find({ objectivecoin: objectivecoin });

    if (objcoin.length > 2)
      throw new AppError(
        'there are already many coins created for the same purpose'
      );

    const newCoin = new CreatorCoin({
      namecreator: req.user.name,
      namecoin,
      namecoinhash: NameHash,
      objectivecoin,
      currentmarketvalue: valuecoin,
    });

    await newCoin.save();

    if (valuecoin > 50000) {
      const qat = Math.floor(Math.random() * 20) + 3;

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

        const newWallet = new Wallet({
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
            $push: { totalcoins: newWallet._id },
            $inc: { moneyincoins: newWallet.amount },
          },
          { new: true }
        );
      }
    } else if (valuecoin > 20000) {
      const qat = Math.floor(Math.random() * 40) + 15;

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

        const newWallet = new Wallet({
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
            $push: { totalcoins: newWallet._id },
            $inc: { moneyincoins: newWallet.amount },
          },
          { new: true }
        );
      }
    } else if (valuecoin > 7500) {
      const qat = Math.floor(Math.random() * 80) + 30;

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

        const newWallet = new Wallet({
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
            $push: { totalcoins: newWallet._id },
            $inc: { moneyincoins: newWallet.amount },
          },
          { new: true }
        );
      }
    } else {
      const qat = Math.floor(Math.random() * 130) + 60;

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

        const newWallet = new Wallet({
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
            $push: { totalcoins: newWallet._id },
            $inc: { moneyincoins: newWallet.amount },
          },
          { new: true }
        );
      }
    }

    return res.status(200).json({ msg: 'create coin success', newCoin });
  }
  public async getMyCoins(req: Request, res: Response) {
    const myCoins = await Wallet.find({ currentowner: req.user.id });

    return res.status(200).json({ myCoins });
  }
  public async myCoinAvaibleForPurchase(req: Request, res: Response) {
    const { _id, codingforbuy, privatekey }: IWallet = req.body;

    const coinExist = await Wallet.findOne({ _id });

    if (!coinExist) throw new AppError('coin not exists');

    if (coinExist.currentowner !== req.user.id)
      throw new AppError('currency is not yours');

    if (coinExist.avaibleforpurchase === true)
      throw new AppError('currency is already on the market available');

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

    return res.status(200).json(newAFP);
  }
  public async searchCoinForPurchase(req: Request, res: Response) {
    const allcoins = await Wallet.find({ avaibleforpurchase: true }).select(
      '-amount -index -prevHash -currentowner -transactions -privatekey'
    );

    return res.status(200).json(allcoins);
  }
  public async bidCoin(req: Request, res: Response) {
    const { publickey, codingforbuy, amount }: IWallet = req.body;

    const coinExists = await Wallet.findOne({ publickey });

    if (!coinExists) throw new AppError('coin not found', 404);

    if (coinExists.codingforbuy !== codingforbuy)
      throw new AppError('coding for buy not found', 404);

    if (coinExists.amount > req.user.moneyoutcoins)
      throw new AppError('small money');

    const mathcoding = Math.random() * 9999999999;
    const codinghash = createHash('sha256')
      .update(`${mathcoding}`)
      .digest('hex');

    const newTransaction = new Transaction({
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
  public async seeBidsOnMyCurrency(req: Request, res: Response) {
    const coins = await Transaction.find({ payee: req.user.id });

    return res.status(200).json({ coins });
  }
  public async confirmBuyCoin(req: Request, res: Response) {
    const {
      privatekey,
      codingforbuy,
      codingconfirm,
      confirmbuy,
      _id,
      hash,
    }: WT = req.body;

    const coinExists = await Wallet.findOne({ privatekey: privatekey });

    if (!coinExists) throw new AppError('private key not found', 404);

    if (coinExists.hash !== hash) throw new AppError('hash not found', 404);

    if (coinExists.currentowner !== req.user.id)
      throw new AppError('moeda nn é sua nn doidao');

    if (!codingforbuy) throw new AppError('favor add um codingforbuy');

    if (coinExists.codingforbuy !== codingforbuy)
      throw new AppError('coding for buy not found', 404);

    const transactionExists = await Transaction.findOne({ codingconfirm });

    if (!transactionExists)
      throw new AppError('codingconfirm nao foi encontrado', 404);

    if (transactionExists.confirmbuy === true)
      throw new AppError('moeda ja foi negociada');

    if (!confirmbuy) throw new AppError('ai nada acontece ne filhao');

    const anyupdate = Math.random() * 9999999999;
    const publick = Math.random() * 9999999999;
    const privatek = Math.random() * 9999999999;

    const hashCoin = createHash('sha256').update(`${anyupdate}`).digest('hex');
    const publicKey = createHash('sha256').update(`${publick}`).digest('hex');
    const privateKey = createHash('sha256').update(`${privatek}`).digest('hex');

    if (confirmbuy === true) {
      const newWallet = await Wallet.findByIdAndUpdate(
        { _id: _id },
        {
          $inc: { index: 1 },
          $push: { prevHash: hash, transactions: transactionExists._id },
          hash: hashCoin,
          currentowener: transactionExists.payer,
          avaibleforpurchase: false,
          publickey: publicKey,
          privatekey: privateKey,
          updatedAt: new Date(),
          $unset: { codingforbuy: '' },
        },
        { new: true }
      );
      const newTransaction = await Transaction.findOneAndUpdate(
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
          $push: { totalcoins: _id },
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
          $pull: { totalcoins: _id },
        },
        { new: true }
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
        msg: 'nenhuma transaçao foi feita',
        newBlock: updateWallet,
        newTransaction: updateTransaction,
      });
    }
  }
  public async sendMoneyWithMoneyTheCoins(req: Request, res: Response) {
    const { name, amount, _id }: SendMoney = req.body;

    const payeeExists = await User.findOne({ name: name });

    if (!payeeExists) throw new AppError('usuario nao encontrado', 404);

    const walletransactionExists = await Wallet.findById(_id);

    if (!walletransactionExists)
      throw new AppError('moeda nao encontrada', 404);

    if (walletransactionExists.amount < amount)
      throw new AppError('dinheiro maior que tem na moeda');

    const transactionExists = await Transaction.findOne({ coin: _id });

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

    const coinpayer = await Wallet.findByIdAndUpdate(
      { _id: _id },
      {
        $inc: { amount: -amount, index: 1 },
        $push: {
          prevHash: walletransactionExists.hash,
          transactions: transactionExists._id,
        },
        hash: hashCoin,
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
      msg: 'dinheiro enviado',
      updatePayer,
      updatePayee,
      coinpayer,
      updateTransaction,
    });
  }
  public async sendMoneyWithMoneyOutCoins(req: Request, res: Response) {
    const { name, amount }: SendMoney = req.body;

    const payeeExists = await User.findOne({ name: name });

    if (!payeeExists) throw new AppError('usuario nao encontrado', 404);

    if (req.user.moneyoutcoins < amount)
      throw new AppError('tem mais dinheiro ai que vc realmente tem');

    const newTransaction = new Transaction({
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
      msg: 'dinheiro enviado',
      updatePayer,
      updatePayee,
      newTransaction,
    });
  }
}