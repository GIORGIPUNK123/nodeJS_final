import express, { Request, Response, NextFunction } from 'express';
const app = express();
const port = 3006;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
import usersRoute from './src/routes/userRoutes/usersDisplay';
import usersLoginRoute from './src/routes/userRoutes/usersLogin';
import usersRegisterRoute from './src/routes/userRoutes/userRegister';
import productsCreate from './src/routes/productRoutes/productsCreate';
import productsDisplay from './src/routes/productRoutes/productsDisplay';
import {
  productCreateSchema,
  productDeleteSchema,
} from './src/validations/productSchema';
import User from './src/database/seqModels/userModel';
import Product from './src/database/seqModels/productsModel';
import { validation } from './src/middlewares/validationMiddleware';
import { loginSchema, registrationSchema } from './src/validations/userSchema';
import { checkLogin } from './src/middlewares/checkLogin';
import { sequelize } from './src/database/sequelizeFunc';
import { database } from './src/database/database';
import rateLimit from 'express-rate-limit';

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:3006`);
});

(async () => {
  const limiter = rateLimit({
    windowMs: 20 * 1000, // 20 seconds
    max: 50, // Limit each IP to 100 requests per `window` (here, per 20 seconds)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    await database();
    console.log('Connection has been established successfully.');
    app.get('/', (req: Request, res: Response) => {
      res.send('App is running :)');
    });
    // USERS
    {
      app.use('/users', usersRoute);
      app.use(
        '/users/register',
        validation(registrationSchema),
        usersRegisterRoute
      );
      app.use('/users/login', validation(loginSchema), usersLoginRoute);
    }
    // OTHER STUFF
    {
      app.use('/products', productsDisplay);
      app.use(
        '/products/create',
        checkLogin(),
        validation(productCreateSchema),
        productsCreate
      );
      app.use(
        '/products/delete',
        checkLogin(),
        validation(productDeleteSchema),
        productsCreate
      );
      app.use(limiter);
    }
  } catch (err) {
    console.error('Unable to connect to the database:', err);
    app.all('*', (req: Request, res: Response) => {
      res.send('Database is down :(');
    });
  }
})();
