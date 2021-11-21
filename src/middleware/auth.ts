import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { AppError } from '../config/AppErrors';

interface TokenPayload {
  id: string;
  iat: number;
  exp: Number;
}

export async function auth(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new AppError('Unathorized', 401);
  }

  const token = authorization.replace('Bearer', '').trim();

  try {
    const data = verify(token, `${process.env.TOKEN_SECRET}`);

    const { id } = data as unknown as TokenPayload;

    req.user.id = id;

    return next();
  } catch {
    throw new AppError('Unathorized', 401);
  }
}
