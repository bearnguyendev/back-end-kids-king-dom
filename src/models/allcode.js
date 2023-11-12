'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Allcode extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Allcode.hasMany(models.User, { foreignKey: 'genderId', as: 'genderData' })
            Allcode.hasMany(models.User, { foreignKey: 'roleId', as: 'roleData' })
            Allcode.hasMany(models.User, { foreignKey: 'typeId', as: 'typeData' })
            Allcode.hasMany(models.Product, { foreignKey: 'categoryId', as: 'categoryData' })
            Allcode.hasMany(models.Product, { foreignKey: 'brandId', as: 'brandData' })
            Allcode.hasMany(models.Product, { foreignKey: 'statusId', as: 'statusData' })
            Allcode.hasMany(models.Product, { foreignKey: 'warrantyId', as: 'warrantyData' })
            Allcode.hasMany(models.Blog, { foreignKey: 'subjectId', as: 'subjectData' })
            Allcode.hasMany(models.TypeVoucher, { foreignKey: 'type', as: 'typeVoucherData' })
            Allcode.hasMany(models.OrderProduct, { foreignKey: 'statusId', as: 'statusOrderData' })
            Allcode.hasMany(models.AgeUseProduct, { foreignKey: 'ageId', as: 'AgeUseProductData' })
        }
    };
    Allcode.init({
        keyMap: DataTypes.STRING,
        type: DataTypes.STRING,
        value: DataTypes.STRING,
        status: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Allcode',
    });
    return Allcode;
};