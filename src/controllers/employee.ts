import { Request, Response } from 'express';
import { createHash } from 'crypto';

import { IUser, User } from '../models/user';
import { Employee, IEmployee } from '../models/employee';
import { Enterprise, IEnterprise } from '../models/enterprise';
import { HiringRequest, IHiring } from '../models/hiringRequest';

import { AppError } from '../config/AppErrors';
import { HydratedDocument } from 'mongoose';

type HP = {
  _id: string;
  hashforhiring: string;
  salary: number;
  day: number;
  month: number;
  year: number;
};

export class EmployeeController {
  public async searchOpenForHiring(req: Request, res: Response): Promise<object> {
    const all: Array<IEnterprise> = await Enterprise.find({ openforhiring: true });

    if (!all)
      throw new AppError("it seems like there's no open company for hiring");

    return res.status(200).json({all});
  }
  public async hiringRequest(req: Request, res: Response): Promise<object> {
    const { _id, curriculum }: IHiring = req.body;

    const enterpriseExist: IEnterprise = await Enterprise.findById({ _id: _id });

    if (!enterpriseExist) throw new AppError('enterprise not found', 404);

    if (enterpriseExist.openforhiring === false)
      throw new AppError('this company is not open for hiring');

    const hRequestUserExist = await HiringRequest.findOne({
      sender: req.user.id,
      addressee: _id,
    });

    if (hRequestUserExist)
      throw new AppError('have you ever submitted a resume to this company');

    const hashforHiring = createHash('md5')
      .update(`${req.user.id}`)
      .digest('hex');

    const newHiringRequest: HydratedDocument<IHiring> = new HiringRequest({
      sender: req.user.id,
      addressee: _id,
      curriculum,
      hashforhiring: hashforHiring,
    });

    await newHiringRequest.save();

    return res.status(200).json({ msg: 'curriculo eviado', newHiringRequest });
  }
  public async searchForHiringRequest(req: Request, res: Response): Promise<object> {
    const allReq: Array<IHiring> = await HiringRequest.find({ addressee: req.enterprise.id });

    if (!allReq) throw new AppError('it seems like it has no hiring request');

    return res.status(200).json({allReq});
  }
  public async hiresPeople(req: Request, res: Response): Promise<object> {
    const { _id, hashforhiring, salary, day }: HP = req.body;

    const employeeExist: IUser = await User.findById({ _id: _id });

    if (!employeeExist) throw new AppError('employee not exist');

    if (employeeExist.employeeEnterprise)
      throw new AppError('that same person is already working in a company');

    const enterpriseExists: IEnterprise = await Enterprise.findOne({ employees: _id });

    if (enterpriseExists) throw new AppError('user already hired');

    const hashExist: IHiring = await HiringRequest.findOne({
      hashforhiring: hashforhiring,
    });

    if (!hashExist) throw new AppError('hash not found');

    const findModelEmployee: IEmployee = await Employee.findOne({
      enterprise: req.enterprise.id,
    });

    if (!findModelEmployee) {
      const newEmployee: HydratedDocument<IEmployee> = new Employee({
        enterprise: req.enterprise.id,
      });

      await newEmployee.save();
    }

    if (hashExist.addressee !== req.enterprise._id)
      throw new AppError('it seems that this vacancy is not for your company');

    let month: number = new Date().getUTCMonth() + 2;
    let year: number = new Date().getUTCFullYear();

    if (month > 12 || month < 1) {
      month = 1;
    } else if (month === 1 && year === new Date().getUTCFullYear()) {
      year = new Date().getUTCFullYear() + 1;
    }

    if (
      (day === 28 && month === 2) ||
      (day === 30 && month === 4) ||
      (day === 30 && month === 6) ||
      (day === 30 && month === 9) ||
      (day === 30 && month === 11) ||
      day > 31
    )
      throw new AppError('dia invalido');

    const upEmployee = await Employee.findOneAndUpdate(
      { enterprise: req.enterprise.id },
      {
        $push: {
          employee: { id: employeeExist._id, name: employeeExist.name },
        },
        salary: salary,
        nextsalary: `"${year}/${month}/${day}`,
      },
      { new: true }
    );

    const upEnterprise = await Enterprise.findByIdAndUpdate(
      { _id: req.enterprise.id },
      { $push: { employees: _id } },
      { new: true }
    );

    const upUser = await User.findByIdAndUpdate(
      { _id: _id },
      { employeeEnterprise: req.enterprise.id },
      { new: true }
    );

    await HiringRequest.findOneAndDelete({
      sender: _id,
      hashforhiring: hashforhiring,
      addressee: req.enterprise.id,
    });

    return res
      .status(200)
      .json({ msg: 'pessoa contratada', upEnterprise, upEmployee, upUser });
  }
}
