// import jwt from 'jsonwebtoken';
// export const login = (infoJson: any) => {};
// import User from '../../database/seqModels/userModel';
// import { validation } from '../../middlewares/validationMiddleware';
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../database/seqModels/userModel';
const saltRounds = 12;

const secretKey = 'ro8BS6Hiivgzy8Xuu09JDjlNLnSLldY5';

export const loginWithJWT = async (jwtToken: string) => {
  return jwt.verify(jwtToken!, secretKey, (err, user: any) => {
    if (err) {
      return null;
    }
    return user.userId;
  });
};
