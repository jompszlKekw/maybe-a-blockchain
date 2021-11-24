import { Router } from 'express';

import { UserController } from './controllers/user';
import { CoinController } from './controllers/coin';

import { authUser, authEnterprise } from './middleware/auth';
import {
  validRegisterEnterprise,
  validRegisterUser,
} from './middleware/validRegister';
import { EnterpriseController } from './controllers/enterprise';
import { ProductController } from './controllers/product';

const routes = Router();

const userController = new UserController();
const coinController = new CoinController();
const enterpriseController = new EnterpriseController();
const productController = new ProductController();

routes.post('/newuser', validRegisterUser, userController.createuser);
routes.post('/loginuser', userController.login);

routes.post('/mycoinsuser', authUser, userController.getMyCoins);

routes.post(
  '/serarchmyproductsuser',
  authUser,
  userController.searchMyProductsUser
);

/**------------------------------------------------------------------------------------- */
routes.post('/createcoin', authUser, coinController.createCoin);

routes.put('/mcafp', authUser, coinController.myCoinAvaibleForPurchase);
routes.get('/searchcoin', authUser, coinController.searchCoinForPurchase);
routes.put('/codingtransaction', authUser, coinController.bidCoin);
routes.put('/confirmbuycoin', authUser, coinController.confirmBuyCoin);
routes.put(
  '/sendmoneycoins',
  authUser,
  coinController.sendMoneyWithMoneyTheCoins
);
routes.put(
  '/sendmoneyoutocoins',
  authUser,
  coinController.sendMoneyWithMoneyOutCoins
);

/**------------------------------------------------------------------------------------- */
routes.post(
  '/registerenterprise',
  validRegisterEnterprise,
  authUser,
  enterpriseController.registerEnterprise
);
routes.post('/loginenterprise', enterpriseController.login);

routes.post(
  '/searchmyproductsenterprise',
  authEnterprise,
  enterpriseController.searchMyProductsEnterprise
);

/**------------------------------------------------------------------------------------- */
routes.post(
  '/registernewproduct',
  authEnterprise,
  productController.createProduct
);
routes.get(
  '/searchmyproductsenterprise',
  authEnterprise,
  productController.searchProducts
);

routes.put('/buyproduct', authUser, productController.buyProduct);

routes.delete(
  '/deleteproduct',
  authEnterprise,
  productController.deleteProduct
);

export { routes };
