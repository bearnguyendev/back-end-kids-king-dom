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
            Receiver.hasMany(models.OrderProduct, { foreignKey: 'receiverId', as: 'receiverData' })
        }
    };
    Receiver.init({
        userId: DataTypes.INTEGER,
        name: DataTypes.STRING,
        address: DataTypes.STRING,
        email: DataTypes.STRING,
        phoneNumber: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Receiver',
    });
    return Receiver;
};