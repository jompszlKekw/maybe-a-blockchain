import { IUser } from '../../models/anyuser';

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}
