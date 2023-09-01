'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class login extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  login.init({
    yourName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    reenterpassword: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'login',
  });
  return login;
};

