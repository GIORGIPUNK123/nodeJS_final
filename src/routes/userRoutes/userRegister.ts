import express from 'express';
import User from '../../database/seqModels/userModel';
import { validation } from '../../middlewares/validationMiddleware';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { tokenGenerator } from '../../login-register/tokenGenerator';
const saltRounds = 12;
const router = express.Router();
router.post('/', async (req, res) => {
  let body = req.body;
  body.password = await bcrypt.hash(req.body.password, saltRounds);
  body.balance = 0;
  body.is_admin = false;
  // const newUser = await User.create({
  //   first_name: body.first_name,
  //   last_name: body.last_name,
  //   phone: body.phone,
  //   email: body.email,
  //   password: body.password,
  // });
  // console.log(newUser.dataValues.id);

  // res
  //   .status(200)
  //   .send(
  //     JSON.stringify({ accessToken: await registration(newUser.dataValues.id) })
  //   );
  // .send(await User.findAll());
});
export default router;
