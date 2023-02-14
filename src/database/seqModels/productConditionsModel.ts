import { DataTypes } from 'sequelize';
import { sequelize } from '../sequelizeFunc';
const ProductCondition = sequelize.define(
  'ProductCondition',
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    condition: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'product_conditions',
    createdAt: false,
    updatedAt: false,
  }
);
export default ProductCondition;
