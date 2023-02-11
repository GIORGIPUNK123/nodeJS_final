import express from 'express';
const app = express();
const port = 3006;

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 12;

import usersRoute from './src/routes/userRoutes';
// import User from './src/database/seqModels/userModel';
import { checkDbConnection } from './src/database/database';

app.get('/', (req: any, res: any) => {
  res.send('Express + TypeScript Server');
});
checkDbConnection();
// databaseConnect
//   .sync()
//   .then((res) => console.log('res: ', res))
//   .catch((err) => console.log(err));
// User;
app.use('/users', usersRoute);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:3006`);
});
