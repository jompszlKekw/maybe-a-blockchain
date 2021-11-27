import { Request, Response } from 'express';
import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';

import { IUser, User } from '../models/user';
import { Product } from '../models/product';
import { Wallet } from '../models/wallet';

import { AppError } from '../config/AppErrors';
export class UserController {
  public async createuser(req: Request, res: Response) {
    const { name, age, password, moneyoutcoins, cpf }: IUser = req.body;

    const nameExists = await User.findOne({ name: name, cpf: cpf });
    if (nameExists) throw new AppError('name exists, add any word');

    const passhash = await hash(password, 12);

    const newUser = new User({
      name,
      age,
      cpf,
      password: passhash,
      moneyoutcoins,
    });

    await newUser.save();

    return res.status(200).json({ newUser });
  }
  public async login(req: Request, res: Response) {
    const { name, password }: IUser = req.body;

    const user = await User.findOne({ name: name });
    if (!user) throw new AppError('name is incorrect');

    const isMatch = await compare(password, user.password);
    if (!isMatch) throw new AppError('password incorrect');

    const token = sign({ id: user._id }, `${process.env.TOKEN_SECRET}`, {
      expiresIn: '1d',
    });

    res.json({
      msg: 'login success',
      user: { ...user._doc, password: '' },
      token,
    });
  }
  public async getMyCoins(req: Request, res: Response) {
    const myCoins = await Wallet.find({ currentowner: req.user.id });

    return res.status(200).json({ myCoins });
  }
  public async searchMyProductsUser(req: Request, res: Response) {
    const all = await Product.find({ proprietor: req.user.id });

    return res.status(200).json(all);
  }
  public async takeCurrencyOutOfTheMarket(req: Request, res: Response) {
    const { change, _id } = req.body;

    const findCoin = await Wallet.findOne({
      _id: _id,
      currentowner: req.user.id,
    });

    if (!findCoin) throw new AppError('Coin not found', 404);

    if (change !== Boolean) throw new AppError('true or false');

    switch (change) {
      case change === true && findCoin.avaibleforpurchase === true:
        throw new AppError('this currency is already on the market');
      case change === false && findCoin.avaibleforpurchase === false:
        throw new AppError('this currency is not on the market');
      case change === true && findCoin.avaibleforpurchase === false:
        await Wallet.findByIdAndUpdate(
          { _id: _id },
          { avaibleforpurchase: true },
          { new: true }
        );

        return res
          .status(200)
          .json({ msg: 'this currency is now available on the market' });
      case change === false && findCoin.avaibleforpurchase === true:
        await Wallet.findByIdAndUpdate(
          { _id: _id },
          { avaibleforpurchase: false },
          { new: true }
        );

        return res.status(200).json({
          msg: 'this currency is no longer available on the market',
        });

      default:
        throw new AppError('internal server error', 500);
    }
  }
}
