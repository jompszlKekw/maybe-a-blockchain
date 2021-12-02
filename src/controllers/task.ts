import { createHash } from 'crypto';
import { Request, Response } from 'express';

import { Employee } from '../models/employee';
import { Task } from '../models/task';
import { Wallet } from '../models/wallet';
import { User } from '../models/user';
import { Enterprise } from '../models/enterprise';
import { CreatorCoin } from '../models/coinCreator';

import { AppError } from '../config/AppErrors';

type TTask = {
  accountable: string;
  description: string;
  reward: string;
  numbers: number;
  text: string;
  _id: string;
};

export class TaskEmployee {
  public async newTask(req: Request, res: Response) {
    const { accountable, description, reward }: TTask = req.body;

    const findEmployee = await Employee.findOne({
      enterprise: req.enterprise._id,
      employeeid: accountable,
    });

    if (!findEmployee) throw new AppError('employee not found');

    const findReward = await Task.findOne({
      reward: reward,
      enterprise: req.enterprise._id,
    });

    if (findReward)
      throw new AppError(
        "this coin already this for another employee's reward"
      );

    const walletReward = await Wallet.findOne({
      _id: reward,
      currentowner: req.enterprise.id,
    });

    if (!walletReward)
      throw new AppError(
        'it seems that this currency is not from that company'
      );

    const newTask = new Task({
      enterprise: req.enterprise._id,
      accountable,
      description,
      reward,
    });

    await newTask.save();

    return res.status(201).json({ msg: 'task created', newTask });
  }
  public async getMyTasks(req: Request, res: Response) {
    const alltask = await Task.find({ accountable: req.user.id });

    if (!alltask) throw new AppError('it seems that has no task for you');

    return res.status(200).json(alltask);
  }
  public async getTasksFromMyCompany(req: Request, res: Response) {
    const alltask = await Task.find({ enterprise: req.enterprise._id });

    if (!alltask)
      throw new AppError(
        'it seems that your company has not assigned any task to any'
      );

    return res.status(200).json(alltask);
  }
  // two simple tasks just to test even
  public async taskOfTypingANumberGreaterThan100(req: Request, res: Response) {
    const { numbers, _id }: TTask = req.body;

    if (numbers < 1000) throw new AppError('imcomplete task');

    const findTask = await Task.findOne({ _id: _id, accountable: req.user.id });

    if (!findTask) throw new AppError('task not found', 404);

    const findCoin = await Wallet.findOne({ _id: findTask.reward });

    if (!findCoin) throw new AppError('coin not found');

    const anyupdate = Math.random() * 9999999967;
    const publick = Math.random() * 9999999998;
    const privatek = Math.random() * 9999999991;

    const hashCoin = createHash('sha256').update(`${anyupdate}`).digest('hex');
    const publicKey = createHash('sha256').update(`${publick}`).digest('hex');
    const privateKey = createHash('sha256').update(`${privatek}`).digest('hex');

    const nameCoin: string = findCoin.hash;
    const [nameinhash] = nameCoin.split('.');
    const coinCreatorExist = await CreatorCoin.findOne({
      namecoinhash: nameinhash,
    });

    if (!coinCreatorExist) throw new AppError(`coin not exist`);

    const upCoinWallet = await Wallet.findOneAndUpdate(
      { _id: findTask.reward },
      {
        $inc: { index: 1 },
        $push: { prevHash: findCoin.hash },
        hash: `${nameinhash}.${hashCoin}`,
        currentowner: req.user.id,
        avaibleforpurchase: false,
        publickey: publicKey,
        privatekey: privateKey,
        updatedAt: new Date(),
      },
      { new: true }
    );

    const upUser = await User.findByIdAndUpdate(
      { _id: req.user.id },
      {
        $inc: { moneyincoins: findCoin.amount },
        $push: {
          totalcoins: { coinid: findTask.reward, namehash: nameinhash },
        },
      },
      { new: true }
    );

    const upEnterprise = await Enterprise.findOneAndUpdate(
      { _id: findTask.enterprise },
      {
        $inc: { moneyincoins: -findCoin.amount },
        $pull: { coins: findTask.reward },
      },
      { new: true }
    );

    const deleteTask = await Task.findByIdAndDelete(
      { _id: _id },
      { new: true }
    );

    return res.status(200).json({
      msg: 'reward delivered, good job',
      upUser,
      upEnterprise,
      upCoinWallet,
      deleteTask,
    });
  }
  public async taskOfMakingATextWithMoreThan1000Words(
    req: Request,
    res: Response
  ) {
    const { text, _id }: TTask = req.body;

    if (text.length < 1050) throw new AppError('imcomplete task');

    const findTask = await Task.findOne({ _id: _id, accountable: req.user.id });

    if (!findTask) throw new AppError('task not found', 404);

    const findCoin = await Wallet.findOne({ _id: findTask.reward });

    if (!findCoin) throw new AppError('coin not found');

    const anyupdate = Math.random() * 9999999967;
    const publick = Math.random() * 9999999998;
    const privatek = Math.random() * 9999999991;

    const hashCoin = createHash('sha256').update(`${anyupdate}`).digest('hex');
    const publicKey = createHash('sha256').update(`${publick}`).digest('hex');
    const privateKey = createHash('sha256').update(`${privatek}`).digest('hex');

    const nameCoin: string = findCoin.hash;
    const [nameinhash] = nameCoin.split('.');
    const coinCreatorExist = await CreatorCoin.findOne({
      namecoinhash: nameinhash,
    });

    if (!coinCreatorExist) throw new AppError(`coin not exist`);

    const upCoinWallet = await Wallet.findOneAndUpdate(
      { _id: findTask.reward },
      {
        $inc: { index: 1 },
        $push: { prevHash: findCoin.hash },
        hash: `${nameinhash}.${hashCoin}`,
        currentowner: req.user.id,
        avaibleforpurchase: false,
        publickey: publicKey,
        privatekey: privateKey,
        updatedAt: new Date(),
      },
      { new: true }
    );

    const upUser = await User.findByIdAndUpdate(
      { _id: req.user.id },
      {
        $inc: { moneyincoins: findCoin.amount },
        $push: {
          totalcoins: { coinid: findTask.reward, namehash: nameinhash },
        },
      },
      { new: true }
    );

    const upEnterprise = await Enterprise.findOneAndUpdate(
      { _id: findTask.enterprise },
      {
        $inc: { moneyincoins: -findCoin.amount },
        $pull: { coins: findTask.reward },
      },
      { new: true }
    );

    const deleteTask = await Task.findByIdAndDelete(
      { _id: _id },
      { new: true }
    );

    return res.status(200).json({
      msg: 'reward delivered, good job',
      upUser,
      upEnterprise,
      upCoinWallet,
      deleteTask,
    });
  }
}
