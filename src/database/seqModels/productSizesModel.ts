import { DataTypes } from 'sequelize';
import { sequelize } from '../sequelizeFunc';
const ProductSize = sequelize.define(
  'ProductSize',
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    size: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'product_sizes',
    createdAt: false,
    updatedAt: false,
  }
);
export default ProductSize;
