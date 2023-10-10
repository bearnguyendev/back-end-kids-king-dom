'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class OrderProduct extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            OrderProduct.belongsTo(models.TypeShip, { foreignKey: 'typeShipId', targetKey: 'id', as: 'typeShipData' })
            OrderProduct.belongsTo(models.Voucher, { foreignKey: 'voucherId', targetKey: 'id', as: 'voucherData' })
            OrderProduct.belongsTo(models.Allcode, { foreignKey: 'statusId', targetKey: 'keyMap', as: 'statusOrderData' })
            OrderProduct.belongsTo(models.Receiver, { foreignKey: 'receiverId', targetKey: 'id', as: 'receiverOrderData' })
            OrderProduct.hasMany(models.OrderDetail, { foreignKey: 'orderId', as: 'orderData' })
            OrderProduct.belongsToMany(models.Product, { through: { model: models.OrderDetail, unique: false }, foreignKey: 'orderId', as: 'OrderDetailData' });
        }
    };
    OrderProduct.init({
        orderDate: DataTypes.STRING,
        orderDateSuccess: DataTypes.STRING,
        receiverId: DataTypes.INTEGER,
        statusId: DataTypes.STRING,
        typeShipId: DataTypes.INTEGER,
        voucherId: DataTypes.STRING,
        note: DataTypes.STRING,
        totalPayment: DataTypes.BIGINT,
        isPaymentOnl: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'OrderProduct',
    });
    return OrderProduct;
};