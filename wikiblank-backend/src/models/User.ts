import { DataTypes, Sequelize } from 'sequelize';
import bcrypt from 'bcryptjs';

export function createModel(database: Sequelize) {
  database.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'users',
    hooks: {
      // using a random salt to protect against rainbow tables
      beforeCreate: async (user: any) => {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  });
}