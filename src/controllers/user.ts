import { compare, hash } from 'bcrypt';
import { Request, Response } from 'express';
import { sign } from 'jsonwebtoken';

import { IUser, User } from '../models/anyuser';
import { AppError } from '../config/AppErrors';
import { Product } from '../models/product';
import { Wallet } from '../models/wallet';

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

    const user = await User.findOne({ name });
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
}
