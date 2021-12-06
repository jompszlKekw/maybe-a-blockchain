import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import { IUser, User } from '../models/user';
import { Enterprise, IEnterprise } from '../models/enterprise';

import { AppError } from '../config/AppErrors';

interface TokenPayload {
  id?: string;
  user: IUser | IEnterprise;
  iat?: number;
  exp?: Number;
}

export async function authUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { authorization } = req.headers;

  if (!authorization) throw new AppError('Unathorized', 401);

  const token = authorization.replace('Bearer', ' ').trim();

  try {
    const data = <TokenPayload>verify(token, `${process.env.TOKEN_SECRET}`);

    if (!data) throw new AppError('Unathorized', 401);

    const user = await User.findOne({ _id: data.id });
    if (!user) throw new AppError('user does not exist');

    req.user = user;

    return next();
  } catch {
    throw new AppError('Unathorized', 401);
  }
}

export async function authEnterprise(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new AppError('Unathorized', 401);
  }

  const token = authorization.replace('Bearer', '').trim();

  try {
    const data = <TokenPayload>verify(token, `${process.env.TOKEN_SECRET}`);

    if (!data) throw new AppError('Unathorized', 401);

    const enterprise = await Enterprise.findOne({ _id: data.id });
    if (!enterprise) throw new AppError('enterprise does not exist');

    req.enterprise = enterprise;

    return next();
  } catch {
    throw new AppError('Unathorized', 401);
  }
}
