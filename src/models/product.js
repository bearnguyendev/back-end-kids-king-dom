'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Product extends Model {

        static associate(models) {
            Product.belongsTo(models.Allcode, { foreignKey: 'categoryId', targetKey: 'keyMap', as: 'categoryData' })
            Product.belongsTo(models.Allcode, { foreignKey: 'brandId', targetKey: 'keyMap', as: 'brandData' })
            Product.belongsTo(models.Allcode, { foreignKey: 'statusId', targetKey: 'keyMap', as: 'statusData' })
            Product.belongsTo(models.Allcode, { foreignKey: 'warrantyId', targetKey: 'keyMap', as: 'warrantyData' })
            Product.hasMany(models.ProductImage, { foreignKey: 'productId', as: 'productImageData' })
            Product.belongsToMany(models.User, { through: { model: models.Cart, unique: false }, foreignKey: 'productId', as: 'ProductUserCartData' });
            Product.belongsToMany(models.OrderProduct, { through: { model: models.OrderDetail, unique: false }, foreignKey: 'productId', as: 'OrderDetailData' });
            Product.hasMany(models.Comment, { foreignKey: "productId", as: "commentProductData" })
            Product.hasMany(models.AgeUseProduct, { foreignKey: 'productId', as: 'productAgeData' })
            Product.hasMany(models.ImportProduct, { foreignKey: 'productId', as: 'importData' })
        }
    };
    Product.init({
        name: DataTypes.STRING,
        statusId: DataTypes.STRING,
        categoryId: DataTypes.STRING,
        brandId: DataTypes.STRING,
        warrantyId: DataTypes.STRING,
        origin: DataTypes.STRING,
        material: DataTypes.STRING,
        view: DataTypes.INTEGER,
        shortDes: DataTypes.TEXT('long'),
        long: DataTypes.STRING,
        width: DataTypes.STRING,
        height: DataTypes.STRING,
        weight: DataTypes.STRING,
        stock: DataTypes.INTEGER,
        count: DataTypes.INTEGER,
        nameDetail: DataTypes.STRING,
        originalPrice: DataTypes.BIGINT,
        percentDiscount: DataTypes.INTEGER,
        discountPrice: DataTypes.BIGINT,
        desHTML: DataTypes.TEXT('long'),
        desMarkdown: DataTypes.TEXT('long'),
    }, {
        sequelize,
        modelName: 'Product',
    });
    return Product;
};