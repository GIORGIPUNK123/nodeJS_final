import { sequelize } from './sequelizeFunc';
import User from './seqModels/userModel';
import Product from './seqModels/productsModel';
import ProductType from './seqModels/productTypesModel';
import ProductCondition from './seqModels/productConditionsModel';
import ProductSize from './seqModels/productSizesModel';

export const database = async () => {
  User.hasMany(Product, {
    foreignKey: 'id',
    onDelete: 'cascade',
  });
  Product.belongsTo(User, {
    foreignKey: 'user_id',
  });

  Product.belongsTo(ProductType, {
    foreignKey: 'type_id',
  });

  Product.belongsTo(ProductCondition, {
    foreignKey: 'condition_id',
  });

  Product.belongsTo(ProductSize, {
    foreignKey: 'size_id',
  });
  // sequelize.sync({ alter: true });
};
