import { DataTypes } from 'sequelize';
import User from './userModel';

import { sequelize } from '../sequelizeFunc';
const Product = sequelize.define(
  'Product',
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    condition_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    is_sold: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    size_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.TIME,
    },
    deleted_at: {
      type: DataTypes.TIME,
    },
    type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'products',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  }
);
export default Product;
