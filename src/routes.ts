import { Router } from 'express';

import { UserController } from './controllers/user';
import { CoinController } from './controllers/coin';

import { auth } from './middleware/auth';
import { validCPF } from './middleware/CNPJCPF';

const routes = Router();

const userController = new UserController();
const coinController = new CoinController();

routes.post('/newuser', validCPF, userController.createuser);
routes.post('/login', userController.login);

routes.post('/createcoin', auth, coinController.createCoin);
routes.get('/mycoins', auth, coinController.getMyCoins);

routes.put('/mcafp', auth, coinController.myCoinAvaibleForPurchase);
routes.get('/searchcoin', auth, coinController.searchCoinForPurchase);
routes.put('/codingtransaction', auth, coinController.bidCoin);
routes.put('/confirmbuycoin', auth, coinController.confirmBuyCoin);
routes.put('/sendmoneycoins', auth, coinController.sendMoneyWithMoneyTheCoins);
routes.put(
  '/sendmoneyoutocoins',
  auth,
  coinController.sendMoneyWithMoneyOutCoins
);

export { routes };
