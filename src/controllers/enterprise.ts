import { sign } from 'jsonwebtoken';
import { compare, hash } from 'bcrypt';
import { AppError } from './../config/AppErrors';
import { Enterprise, IEnterprise } from './../models/enterprise';
import { Request, Response } from 'express';
import { User } from '../models/anyuser';
import { Product } from '../models/product';

export class EnterpriseController {
  public async registerEnterprise(req: Request, res: Response) {
    const { name, owners, cnpj, email, password, moneyoutcoins }: IEnterprise =
      req.body;

    const enterpriseExists = await Enterprise.findOne({
      name: name,
      email: email,
      cnpj: cnpj,
    });

    if (enterpriseExists) throw new AppError('name, cnpj or email exists');

    const findOwner = await User.findOne({ name: owners });

    if (!findOwner) throw new AppError('Owner not found');

    const passHash = await hash(password, 12);

    const newEnterprise = new Enterprise({
      name,
      owners: findOwner.id,
      cnpj,
      email,
      password: passHash,
      moneyoutcoins,
    });

    await newEnterprise.save();

    const upOwner = await User.findByIdAndUpdate(
      { _id: findOwner.id },
      { $push: { ownerenterprise: newEnterprise.id } },
      { new: true }
    );

    return res.status(200).json({ newEnterprise, upOwner });
  }
  public async login(req: Request, res: Response) {
    const { email, password }: IEnterprise = req.body;

    const enterprise = await Enterprise.findOne({ email });
    if (!enterprise) throw new AppError('email is incorrect');

    const isMatch = await compare(password, enterprise.password);
    if (!isMatch) throw new AppError('password incorrect');

    const token = sign({ id: enterprise._id }, `${process.env.TOKEN_SECRET}`, {
      expiresIn: '1d',
    });

    res.json({
      msg: 'login success',
      enterprise: { ...enterprise._doc, password: '' },
      token,
    });
  }
  public async searchMyProductsEnterprise(req: Request, res: Response) {
    const all = await Product.find({
      enterprise: req.enterprise.id,
      sold: false,
    });

    return res.status(200).json(all);
  }
}
