import { Appreciation } from '../models/appreciationOfTheCurrency';
import { CreatorCoin } from '../models/coinCreator';
import { User } from '../models/user';
import { Wallet } from '../models/wallet';

/**
 * Aqui também irei escrever em português
 * Isso foi um experimento para ver se iria dar certo, e não deu.
 * Mas para simplificar, iria ser tipo um mercado de ações, quando um moeda estivesse em muita procura
 * ela iria aumentar seu valor com uma porcentagem do seu valor, se o valor dela fosse maior precisaria de menos 
 * compras da mesma para assim ela aumentar o preço, se o preço fosse menor precisaria de mais compras para
 * elas aumentar o valor.
 * Isso foi uma coisa que pensei de ultima hora, e só tentei fazer, e não vou ficar muito tempo aqui.
 * Talvez depois posso voltar e arrumar e deixar esta função funcional.
 */

(async (): Promise<void> => {
  const findAppreciation = await Appreciation.findOne({});

  if (!findAppreciation) return;

  if (
    findAppreciation.currentvalue > 50000 &&
    findAppreciation.totalcoinspurchase === 10
  ) {
    const numberPorcent: number = Math.floor(Math.random() * 8) + 2;
    const addPorcentagem: number =
      (numberPorcent / 100) * findAppreciation.currentvalue;

    const upCreator = await CreatorCoin.findOneAndUpdate(
      { namecoinhash: findAppreciation.nameHashCoin },
      {
        $inc: { currentmarketvalue: +addPorcentagem },
        updatedAt: new Date(),
      }
    );

    await Appreciation.findByIdAndUpdate(
      { _id: findAppreciation._id },
      {
        $push: {
          prevHash: { $inc: { value: +addPorcentagem } },
          dateUpdate: new Date(),
        },
        $inc: { currentvalue: +addPorcentagem },
        totalcoinspurchase: 0,
      }
    );

    async function upUserAndWallet() {
      const findUser = await User.findOne({
        namehashcoin: findAppreciation!.nameHashCoin,
      });
      if (!findUser) return;

      const strToday = JSON.stringify(new Date());

      const [Year, Month, day] = strToday.split('-');
      const [Day, others] = day.split('T');

      const formatDate = `${Year}/${Month}/${Day}`;

      const findWalletUser = await Wallet.find({
        _id: findUser.totalcoins,
        $nor: [{ lastmarketvalueupdate: formatDate }],
      });

      if (!findWalletUser) return;

      await Wallet.updateMany(
        { currentowner: findUser._id },
        {
          $inc: { amount: +addPorcentagem },
          lastmarketvalueupdate: formatDate,
        }
      );

      // await User.findByIdAndUpdate(
      //   { _id: findUser._id },
      //   {
      //     $inc: { moneyincoins: findWalletUser.amount },
      //   }
      // );
    }

    setInterval(upUserAndWallet, 2000);
    console.log(
      `A moeda ${upCreator?.namecoin} teve o valor aumentado, agora ela esta valendo ${upCreator?.currentmarketvalue}`
    );
  } else if (
    findAppreciation.currentvalue > 20000 &&
    findAppreciation.currentvalue < 50000 &&
    findAppreciation.totalcoinspurchase === 25
  ) {
    const numberPorcent: number = Math.floor(Math.random() * 14) + 2;
    const addPorcentagem: number =
      (numberPorcent / 100) * findAppreciation.currentvalue;

    const upCreator = await CreatorCoin.findOneAndUpdate(
      { namecoinhash: findAppreciation.nameHashCoin },
      {
        $inc: { currentmarketvalue: +addPorcentagem },
        updatedAt: new Date(),
      }
    );

    await Appreciation.findByIdAndUpdate(
      { _id: findAppreciation._id },
      {
        $push: {
          prevHash: { $inc: { value: +addPorcentagem } },
          dateUpdate: new Date(),
        },
        $inc: { currentvalue: +addPorcentagem },
        totalcoinspurchase: 0,
      }
    );

    async function upUserAndWallet() {
      const findUser = await User.findOne({
        namehashcoin: findAppreciation!.nameHashCoin,
      });
      if (!findUser) return;

      const strToday = JSON.stringify(new Date());

      const [Year, Month, day] = strToday.split('-');
      const [Day, others] = day.split('T');

      const formatDate = `${Year}/${Month}/${Day}`;

      const findWalletUser = await Wallet.find({
        _id: findUser.totalcoins,
        $nor: [{ lastmarketvalueupdate: formatDate }],
      });

      if (!findWalletUser) return;

      await Wallet.updateMany(
        { currentowner: findUser._id },
        {
          $inc: { amount: +addPorcentagem },
          lastmarketvalueupdate: formatDate,
        }
      );

      // await User.findByIdAndUpdate(
      //   { _id: findUser._id },
      //   {
      //     $inc: { moneyincoins: findWalletUser.amount },
      //   }
      // );
    }

    setInterval(upUserAndWallet, 2000);
    console.log(
      `A moeda ${upCreator?.namecoin} teve o valor aumentado, agora ela esta valendo ${upCreator?.currentmarketvalue}`
    );
  } else if (
    findAppreciation.currentvalue > 7500 &&
    findAppreciation.currentvalue < 20000 &&
    findAppreciation.totalcoinspurchase === 35
  ) {
    const numberPorcent: number = Math.floor(Math.random() * 19) + 2;
    const addPorcentagem: number =
      (numberPorcent / 100) * findAppreciation.currentvalue;

    const upCreator = await CreatorCoin.findOneAndUpdate(
      { namecoinhash: findAppreciation.nameHashCoin },
      {
        $inc: { currentmarketvalue: +addPorcentagem },
        updatedAt: new Date(),
      }
    );

    await Appreciation.findByIdAndUpdate(
      { _id: findAppreciation._id },
      {
        $push: {
          prevHash: { $inc: { value: +addPorcentagem } },
          dateUpdate: new Date(),
        },
        $inc: { currentvalue: +addPorcentagem },
        totalcoinspurchase: 0,
      }
    );

    async function upUserAndWallet() {
      const findUser = await User.findOne({
        namehashcoin: findAppreciation!.nameHashCoin,
      });
      if (!findUser) return;

      const strToday = JSON.stringify(new Date());

      const [Year, Month, day] = strToday.split('-');
      const [Day, others] = day.split('T');

      const formatDate = `${Year}/${Month}/${Day}`;

      const findWalletUser = await Wallet.find({
        _id: findUser.totalcoins,
        $nor: [{ lastmarketvalueupdate: formatDate }],
      });

      if (!findWalletUser) return;

      await Wallet.updateMany(
        { currentowner: findUser._id },
        {
          $inc: { amount: +addPorcentagem },
          lastmarketvalueupdate: formatDate,
        }
      );

      // await User.findByIdAndUpdate(
      //   { _id: findUser._id },
      //   {
      //     $inc: { moneyincoins: findWalletUser.amount },
      //   }
      // );
    }

    setInterval(upUserAndWallet, 2000);
    console.log(
      `A moeda ${upCreator?.namecoin} teve o valor aumentado, agora ela esta valendo ${upCreator?.currentmarketvalue}`
    );
  } else if (
    findAppreciation.currentvalue < 7500 &&
    findAppreciation.totalcoinspurchase === 45
  ) {
    const numberPorcent: number = Math.floor(Math.random() * 24) + 2;
    const addPorcentagem: number =
      (numberPorcent / 100) * findAppreciation.currentvalue;

    const upCreator = await CreatorCoin.findOneAndUpdate(
      { namecoinhash: findAppreciation.nameHashCoin },
      {
        $inc: { currentmarketvalue: +addPorcentagem },
        updatedAt: new Date(),
      }
    );

    await Appreciation.findByIdAndUpdate(
      { _id: findAppreciation._id },
      {
        $push: {
          prevHash: { $inc: { value: +addPorcentagem } },
          dateUpdate: new Date(),
        },
        $inc: { currentvalue: +addPorcentagem },
        totalcoinspurchase: 0,
      }
    );

    async function upUserAndWallet() {
      const findUser = await User.findOne({
        namehashcoin: findAppreciation!.nameHashCoin,
      });
      if (!findUser) return;

      const strToday = JSON.stringify(new Date());

      const [Year, Month, day] = strToday.split('-');
      const [Day, others] = day.split('T');

      const formatDate = `${Year}/${Month}/${Day}`;

      const findWalletUser = await Wallet.find({
        _id: findUser.totalcoins,
        $nor: [{ lastmarketvalueupdate: formatDate }],
      });

      if (!findWalletUser) return;

      await Wallet.updateMany(
        { currentowner: findUser._id },
        {
          $inc: { amount: +addPorcentagem },
          lastmarketvalueupdate: formatDate,
        }
      );

      // await User.findByIdAndUpdate(
      //   { _id: findUser._id },
      //   {
      //     $inc: { moneyincoins: findWalletUser.amount },
      //   }
      // );
    }

    setInterval(upUserAndWallet, 2000);
    console.log(
      `A moeda ${upCreator?.namecoin} teve o valor aumentado, agora ela esta valendo ${upCreator?.currentmarketvalue}`
    );
  } else console.log('nenhum valor de nenhuma moeda foi alterada');
})();
