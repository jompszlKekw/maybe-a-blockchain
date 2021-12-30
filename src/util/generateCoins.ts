import { createHash } from 'crypto';
import { HydratedDocument } from 'mongoose';
import { User } from '../models/user';
import { Wallet, IWallet } from '../models/wallet';

export async function GenerateCoinsUser(
  qatNumber: number,
  qatNumberSome: number,
  valuecoin: number,
  NameHash: string,
  reqUser: string
): Promise<void> {
  const qat: number = Math.floor(Math.random() * qatNumber) + qatNumberSome;

  for (let i = 0; i < qat; i++) {
    const anyupdate = Math.random() * 9999999998;
    const publick = Math.random() * 9999999997;
    const privatek = Math.random() * 9999999996;

    const hashCoin = createHash('sha512')
      .update(`${anyupdate}` + i)
      .digest('hex');

    // const keypair = generateKeyPairSync('rsa', {
    //   modulusLength: 2048,
    //   publicKeyEncoding: { type: 'spki', format: 'pem' },
    //   privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    // })

    const publicKey = createHash('sha512').update(`${publick}`).digest('hex');
    const privateKey = createHash('sha512').update(`${privatek}`).digest('hex');

    const newWallet: HydratedDocument<IWallet> = new Wallet({
      amount: valuecoin,
      hash: `${NameHash}.${hashCoin}`,
      currentowner: reqUser,
      publickey: publicKey,
      privatekey: privateKey,
    });
    await newWallet.save();

    await User.findByIdAndUpdate(
      { _id: reqUser },
      {
        $push: {
          totalcoins: newWallet._id,
        },
        $inc: { moneyincoins: newWallet.amount },
      },
      { new: true }
    );
  }
}
