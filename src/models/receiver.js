'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Receiver extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Receiver.hasMany(models.OrderProduct, { foreignKey: 'receiverId', as: 'receiverOrderData' })
            Receiver.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', as: 'userData' })
        }
    };
    Receiver.init({
        userId: DataTypes.INTEGER,
        name: DataTypes.STRING,
        address: DataTypes.STRING,
        phoneNumber: DataTypes.STRING,
        status: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'Receiver',
    });
    return Receiver;
};