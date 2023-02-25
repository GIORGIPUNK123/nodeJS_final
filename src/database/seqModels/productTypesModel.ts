import { DataTypes } from 'sequelize';
import { sequelize } from '../sequelizeFunc';
import User from './usersModel';

const ProductType = sequelize.define(
  'ProductType',
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'product_types',
    createdAt: false,
    updatedAt: false,
  }
);
export default ProductType;
