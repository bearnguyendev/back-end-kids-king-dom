'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            User.belongsTo(models.Allcode, { foreignKey: 'genderId', targetKey: 'keyMap', as: 'genderData' })
            User.belongsTo(models.Allcode, { foreignKey: 'roleId', targetKey: 'keyMap', as: 'roleData' })
            User.belongsTo(models.Allcode, { foreignKey: 'typeId', targetKey: 'keyMap', as: 'typeData' })
            User.belongsToMany(models.Voucher, { through: { model: models.VoucherUsed }, foreignKey: 'userId', as: 'VoucherOfUser' });
            User.belongsToMany(models.Product, { through: { model: models.Cart, unique: false }, foreignKey: 'userId', as: 'ProductUserCartData' });
            User.hasMany(models.Receiver, { foreignKey: 'userId', as: 'userData' })
            User.hasMany(models.Comment, { foreignKey: 'userId', as: 'userCommentData' })
        }
    };
    User.init({
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        address: DataTypes.STRING,
        birthday: DataTypes.STRING,
        phoneNumber: DataTypes.STRING,
        image: DataTypes.BLOB('long'),
        statusId: DataTypes.STRING,
        genderId: DataTypes.STRING,
        roleId: DataTypes.STRING,
        ActiveEmail: DataTypes.BOOLEAN,
        userToken: DataTypes.STRING,
        typeId: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'User',
    });
    return User;
};