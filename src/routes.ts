import { Router } from 'express';

import { UserController } from './controllers/user';
import { CoinController } from './controllers/coin';
import { EmployeeController } from './controllers/employee';
import { EnterpriseController } from './controllers/enterprise';
import { ProductController } from './controllers/product';
import { TaskEmployee } from './controllers/task';

import { authUser, authEnterprise } from './middleware/auth';
import {
  validRegisterEnterprise,
  validRegisterUser,
} from './middleware/validRegister';

const routes = Router();

const userController = new UserController();
const coinController = new CoinController();
const enterpriseController = new EnterpriseController();
const productController = new ProductController();
const employeeController = new EmployeeController();
const taskController = new TaskEmployee();

routes.post('/newuser', validRegisterUser, userController.createuser);
routes.post('/loginuser', userController.login);

routes.get('/mycoinsuser', authUser, userController.getMyCoins);

routes.get(
  '/serarchmyproductsuser',
  authUser,
  userController.searchMyProductsUser
);

routes.put(
  '/takeCurrencyOutOfTheMarket',
  authUser,
  userController.takeCurrencyOutOfTheMarket
);

/**------------------------------------------------------------------------------------- */
routes.post('/createcoin', authUser, coinController.createCoinUser);

routes.put('/mcafp', authUser, coinController.myCoinAvaibleForPurchase);
routes.get('/searchcoin', authUser, coinController.searchCoinForPurchase);
routes.post('/codingtransaction', authUser, coinController.bidCoin);
routes.get(
  '/seebidsonmycurrency',
  authUser,
  coinController.seeBidsOnMyCurrency
);
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

routes.post(
  '/createcoinenterprise',
  authEnterprise,
  coinController.createCoinEnterprise
);

/**------------------------------------------------------------------------------------- */
routes.post(
  '/registerenterprise',
  validRegisterEnterprise,
  authUser,
  enterpriseController.registerEnterprise
);
routes.post('/loginenterprise', enterpriseController.login);

routes.get(
  '/searchmyproductsenterprise',
  authEnterprise,
  enterpriseController.searchMyProductsEnterprise
);

routes.put(
  '/changeOpenForHiring',
  authEnterprise,
  enterpriseController.changeOpenForHiring
);

routes.get('/mycoinsenterprise', authEnterprise, enterpriseController.getcoins);

/**------------------------------------------------------------------------------------- */
routes.post(
  '/registernewproduct',
  authEnterprise,
  productController.createProduct
);
routes.get('/searchproducts', productController.searchProducts);

routes.put('/buyproduct', authUser, productController.buyProduct);

routes.delete(
  '/deleteproduct',
  authEnterprise,
  productController.deleteProduct
);

/**------------------------------------------------------------------------------------- */

routes.get(
  '/searchopenforhiring',
  authUser,
  employeeController.searchOpenForHiring
);

routes.post('/hiringrequest', authUser, employeeController.hiringRequest);

routes.get(
  '/searchforhiringrequest',
  authEnterprise,
  employeeController.searchForHiringRequest
);

routes.put('/hirespeople', authEnterprise, employeeController.hiresPeople);

/**------------------------------------------------------------------------------------- */

routes.post('/newtask', authEnterprise, taskController.newTask);

routes.get('/getmytasks', authUser, taskController.getMyTasks);
routes.get(
  '/taskfrommycompany',
  authEnterprise,
  taskController.getTasksFromMyCompany
);

routes.put('/task100numbers', authUser, taskController.taskOfMakingATextWithMoreThan1000Words);

routes.put(
  '/task100numbers',
  authUser,
  taskController.taskOfTypingANumberGreaterThan100
);
routes.put(
  '/task1000words',
  authUser,
  taskController.taskOfMakingATextWithMoreThan1000Words
);

export { routes };
