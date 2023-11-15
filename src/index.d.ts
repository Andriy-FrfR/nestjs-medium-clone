import { UserEntity } from './modules/user/user.entity';

declare global {
  namespace Express {
    interface Request {
      user?: UserEntity;
    }
  }
}
