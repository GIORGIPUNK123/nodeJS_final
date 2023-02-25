import express from 'express';
const router = express.Router();
import { validation } from '../middlewares/validationMiddleware';
import { loginSchema, registrationSchema } from '../validations/userSchema';
import dotenv from 'dotenv';
import { display, login, register } from '../controllers/authController';
dotenv.config();

// display route
router.get('/:id?', display);

// login
router.post('/login', validation(loginSchema), login);

// register
router.post('/register', validation(registrationSchema), register);

export default router;
