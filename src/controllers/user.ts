import { compare, hash } from 'bcrypt';
import { Request, Response } from 'express';
import { sign } from 'jsonwebtoken';

import { IUser, User } from '../models/anyuser';
import { AppError } from '../config/AppErrors';

export class UserController {
  public async createuser(req: Request, res: Response) {
    const { name, age, password, moneyoutcoins, cpf }: IUser = req.body;

    const nameExists = await User.findOne({ name });
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

    const token = sign({ id: user.id }, `${process.env.TOKEN_SECRET}`, {
      expiresIn: '1d',
    });

    res.json({
      msg: 'login success',
      user: { ...user._doc, password: '' },
      token,
    });
  }
}
