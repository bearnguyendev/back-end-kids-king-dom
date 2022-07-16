'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ProductImage extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            ProductImage.belongsTo(models.Product, { foreignKey: 'productId', targetKey: 'id', as: 'productImageData' })
        }
    };
    ProductImage.init({
        title: DataTypes.STRING,
        productId: DataTypes.INTEGER,
        image: DataTypes.BLOB('long')
    }, {
        sequelize,
        modelName: 'ProductImage',
    });
    return ProductImage;
};