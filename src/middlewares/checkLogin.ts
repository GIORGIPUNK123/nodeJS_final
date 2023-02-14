import { Request, Response, NextFunction } from 'express';
import { loginWithJWT } from '../login-register/login';

interface CustomRequest extends Request {
  userId?: number;
  email?: string;
  password?: string;
}
export const checkLogin =
  () => async (req: CustomRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      return next();
    }
    try {
      const userId = await loginWithJWT(token);
      console.log('userId: ', userId);
      req.userId! = userId!;
      next();
    } catch (err) {
      next(err);
    }
  };
