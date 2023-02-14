// import User from '../../database/seqModels/userModel';
// import { validation } from '../../middlewares/validationMiddleware';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const saltRounds = 12;

const secretKey = 'ro8BS6Hiivgzy8Xuu09JDjlNLnSLldY5';

export const tokenGenerator = async (userId: number) => {
  const token = jwt.sign({ userId }, secretKey);
  return token;
};
