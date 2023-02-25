import { Request, response, Response } from 'express';
import User from '../database/seqModels/usersModel';
import bcrypt from 'bcrypt';
import { tokenGenerator } from '../services/authService';
import { findModelByValues } from '../services/helperService';

export const display = async (req: Request, res: Response) => {
  try {
    const whereClause = req.params.id
      ? { id: req.params.id }
      : { is_deleted: false };

    const users = await User.findAll({ where: whereClause });

    if (req.params.id && !users.length) {
      res
        .status(404)
        .send({ error: `User with ID ${req.params.id} not found` });
    } else {
      res.send(users);
    }
  } catch (err: any) {
    res.status(500).send({ error: `Error finding users: ${err.message}` });
    console.error(`Error from users display route: `, err);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const passwordMatches = await bcrypt.compare(
      password,
      user.dataValues.password
    );
    if (!passwordMatches) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const accessToken = await tokenGenerator(user.dataValues.id);
    return res.json({ accessToken });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Internal Server Error` });
  }
};
export const register = async (req: Request, res: Response) => {
  const { first_name, last_name, phone, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(
    password,
    parseInt(process.env.SALT_ROUNDS as string)
  );
  const newUser = {
    first_name,
    last_name,
    phone,
    email,
    password: hashedPassword,
    balance: 0,
    is_admin: false,
  };
  try {
    const emailExists = await findModelByValues(User, { email });
    if (emailExists) {
      return res
        .status(400)
        .json({ error: 'Email already exists in the database' });
    }

    const phoneExists = await findModelByValues(User, { phone });
    if (phoneExists) {
      return res
        .status(400)
        .json({ error: 'Phone already exists in the database' });
    }

    const createdUser = await User.create(newUser);
    const accessToken = await tokenGenerator(createdUser.dataValues.id);
    return res.json({ accessToken });
  } catch (err: any) {
    console.error(`error from register route: `, err.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
