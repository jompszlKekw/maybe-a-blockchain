import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/user';
import { IEnterprise } from '../models/enterprise';

export async function validRegisterUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name, age, cpf, password, moneyoutcoins }: IUser = req.body;

  const errors: string[] = [];

  if (!cpf) {
    errors.push('Please add your CPF');
  } else if (!CPF(cpf)) {
    errors.push('CPF form is incorrect');
  }

  if (!name) {
    errors.push('Please add your name');
  } else if (name.length > 20) {
    errors.push('Your name is up to 20 chars long');
  }

  if (!age) {
    errors.push('please add your age');
  } else if (age < 18) {
    errors.push("come back when you're an adult");
  }

  if (moneyoutcoins > 100000) {
    errors.push('a lot of money');
  }

  if (password.length < 6) {
    errors.push('password must be at least 6 chars');
  }

  if (errors.length > 0) return res.status(400).json({ msg: errors });
  next();
}

export async function validRegisterEnterprise(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name, owners, cnpj, email, password, moneyoutcoins }: IEnterprise =
    req.body;

  const errors: string[] = [];

  if (!cnpj) {
    errors.push('Please add your CPF');
  } else if (!CNPJ(cnpj)) {
    errors.push('CPF form is incorrect');
  }

  if (!name) {
    errors.push('Please add your name');
  } else if (name.length > 20) {
    errors.push('Your name is up to 20 chars long');
  }

  if (!owners) {
    errors.push('please add an owner ');
  }

  if (!email) {
    errors.push('Please add your email');
  } else if (!validateEmail(email)) {
    errors.push('Email format is incorrect');
  }

  if (moneyoutcoins > 1000000) {
    errors.push('a lot of money');
  }

  if (password.length < 6) {
    errors.push('password must be at least 6 chars');
  }

  if (errors.length > 0) return res.status(400).json({ msg: errors });
  next();
}

export function CPF(cpf: string) {
  const re = /([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})/;
  return re.test(String(cpf).toLowerCase());
}

export function CNPJ(cnpj: string) {
  const re = /([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})/;
  return re.test(String(cnpj).toLowerCase());
}

export function validateEmail(email: string) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
