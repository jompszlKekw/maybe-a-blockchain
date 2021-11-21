import { Request, Response, NextFunction } from 'express';

interface ICC {
  cpf: string;
  cnpj: string;
}

export async function validCPF(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { cpf }: ICC = req.body;

  if (!cpf) {
    return res.status(400).json({ msg: 'Please add your CPF' });
  } else if (!CPF(cpf)) {
    return res.status(400).json({ msg: 'CPF form is incorrect' });
  }

  next();
}

export async function validCNPJ(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { cnpj }: ICC = req.body;

  if (!cnpj) {
    return res.status(400).json({ msg: 'Please add your CNPJ' });
  } else if (!CNPJ(cnpj)) {
    return res.status(400).json({ msg: 'CNPJ form is incorrect' });
  }

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
