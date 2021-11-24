import { IUser } from '../../models/anyuser';
import { IEnterprise } from '../../models/enterprise';

declare global {
  namespace Express {
    interface Request {
      user: IUser;
      enterprise: IEnterprise;
    }
  }
}
