'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ImportProduct extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            ImportProduct.belongsTo(models.Product, { foreignKey: 'productId', targetKey: 'id', as: 'importData' })
        }
    };
    ImportProduct.init({
        productId: DataTypes.INTEGER,
        quantity: DataTypes.INTEGER,
        priceImport: DataTypes.BIGINT,
    }, {
        sequelize,
        modelName: 'ImportProduct',
    });
    return ImportProduct;
};