'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class AgeUseProduct extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            AgeUseProduct.belongsTo(models.Product, { foreignKey: 'productId', targetKey: 'id', as: 'productAgeData' })
            AgeUseProduct.belongsTo(models.Allcode, { foreignKey: 'ageId', targetKey: 'keyMap', as: 'AgeUseProductData' })
        }
    };
    AgeUseProduct.init({
        ageId: DataTypes.STRING,
        productId: DataTypes.INTEGER,
        status: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'AgeUseProduct',
    });
    return AgeUseProduct;
};