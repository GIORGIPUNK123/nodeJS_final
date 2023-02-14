import express from 'express';
import User from '../../database/seqModels/userModel';
import { validation } from '../../middlewares/validationMiddleware';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { tokenGenerator } from '../../login-register/tokenGenerator';
const saltRounds = 12;
const router = express.Router();
import { Request, Response, NextFunction } from 'express';

router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).send({ message: `User doesn't exist` });
    }
    const passwordMatches = await bcrypt.compare(
      password,
      user.dataValues.password
    );
    if (!passwordMatches) {
      return res.status(400).send({ message: `Password is incorrect` });
    }
    const accessToken = await tokenGenerator(user.dataValues.id);
    return res.status(200).send(JSON.stringify({ accessToken }));
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: `Internal Server Error` });
  }
});

export default router;
