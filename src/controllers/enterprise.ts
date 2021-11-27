import { Request, Response } from 'express';
import { sign } from 'jsonwebtoken';
import { compare, hash } from 'bcrypt';

import { Enterprise, IEnterprise } from './../models/enterprise';
import { User } from '../models/user';
import { Product } from '../models/product';

import { AppError } from './../config/AppErrors';
import { Employee } from '../models/employee';

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

    const newEmployee = new Employee({
      enterprise: req.enterprise._id,
    });

    await newEmployee.save();

    return res.status(200).json({ newEnterprise, upOwner });
  }
  public async login(req: Request, res: Response) {
    const { email, password }: IEnterprise = req.body;

    const enterprise = await Enterprise.findOne({ email: email });
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

    if (!all)
      throw new AppError("it seems that you haven't produced any products");

    return res.status(200).json(all);
  }
  public async changeOpenForHiring(req: Request, res: Response) {
    const { change } = req.body;

    const findEnterprise = await Enterprise.findOne({ _id: req.enterprise.id });

    if (!findEnterprise)
      throw new AppError('Internal server error, your company not exist', 500);

    switch (change) {
      case change === true && findEnterprise.openforhiring === true:
        throw new AppError('a empresa ja esta aberta para contrataçoes');
      case change === false && findEnterprise.openforhiring === false:
        throw new AppError('a empresa nao esta aberta para contrataçoes ja');
      case change === true && findEnterprise.openforhiring === false:
        await Enterprise.findOneAndUpdate(
          { _id: req.enterprise.id },
          { openforhiring: true },
          { new: true }
        );

        return res
          .status(200)
          .json({ msg: 'a empresa agora esta aberta para fazer contrataçoes' });
      case change === false && findEnterprise.openforhiring === true:
        await Enterprise.findOneAndUpdate(
          { _id: req.enterprise.id },
          { openforhiring: false },
          { new: true }
        );

        return res
          .status(200)
          .json({ msg: 'a empresa agora esta fechada para contrataçoes' });
      default:
        throw new AppError('internal server error', 500);
    }
  }
}
