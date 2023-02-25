import express, { Request, Response, NextFunction } from 'express';
const app = express();
const port = 3006;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
import userRoutes from './src/routes/userRoutes';
import productRoutes from './src/routes/productRoutes';
import transactionsDisplayRoute from './src/routes/transactionsDisplay';
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
      app.use(`/users`, userRoutes);
    }
    // OTHER STUFF
    app.use(`/products`, productRoutes);
    app.use(`/transactions`, transactionsDisplayRoute);
    app.use(limiter);
  } catch (err) {
    console.error('Unable to connect to the database:', err);
    app.all('*', (req: Request, res: Response) => {
      res.send('Database is down :(');
    });
  }
})();
