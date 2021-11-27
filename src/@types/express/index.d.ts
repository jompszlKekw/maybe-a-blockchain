import { IUser } from '../../models/user';
import { IEnterprise } from '../../models/enterprise';

declare global {
  namespace Express {
    interface Request {
      user: IUser;
      enterprise: IEnterprise;
    }
  }
}
