import { DataTypes } from 'sequelize';
import { sequelize } from '../database';

console.log('sequelize ', sequelize);
const User = sequelize.define(
  'User',
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    balance: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.INTEGER,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
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
  },
  {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  }
);
export default User;

(async () => {
  console.log('Users: ', await User.findAll());
})();
