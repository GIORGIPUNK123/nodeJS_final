import { Sequelize } from 'sequelize';
import User from './seqModels/userModel';

export const sequelize = new Sequelize('main', 'root', '123456', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

export const checkDbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};
console.log('USERRR', User);
