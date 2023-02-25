import dotenv from 'dotenv';
dotenv.config();
import config from './config.json';
import { Sequelize, Dialect } from 'sequelize';
console.log('process.env.DATABASE: ', process.env.DATABASE);
console.log('process.env.USER: ', process.env.USER);
console.log('process.env.PASSWORD: ', process.env.PASSWORD);
console.log('process.env.HOST: ', process.env.HOST);
console.log('process.env.DIALECT: ', process.env.DIALECT);
export const sequelize = new Sequelize(
  process.env.DATABASE as string,
  process.env.USER as string,
  process.env.PASSWORD as string,
  {
    host: process.env.HOST as string,
    dialect:
      (process.env.DIALECT as 'mysql') ||
      'postgres' ||
      'sqlite' ||
      'mariadb' ||
      'mssql',
    logging: false,
  }
);
