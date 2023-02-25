import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
export const loginWithJWT = async (jwtToken: string) => {
  return jwt.verify(
    jwtToken!,
    process.env.JWT_SECRET as string,
    (err, user: any) => {
      if (err) {
        return null;
      }
      return user.userId;
    }
  );
};

export const tokenGenerator = async (userId: number) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET as string);
  return token;
};
