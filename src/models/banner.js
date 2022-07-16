'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Banner extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

        }
    };
    Banner.init({
        name: DataTypes.STRING,
        statusId: DataTypes.STRING,
        image: DataTypes.BLOB('long'),
        description: DataTypes.TEXT('long')
    }, {
        sequelize,
        modelName: 'Banner',
    });
    return Banner;
};