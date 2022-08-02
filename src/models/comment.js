'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Comment extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Comment.belongsTo(models.Product, { foreignKey: 'productId', targetKey: 'id', as: 'commentProductData' })
            Comment.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', as: 'userCommentData' })
        }
    };
    Comment.init({
        content: DataTypes.TEXT('long'),
        image: DataTypes.BLOB('long'),
        parentId: DataTypes.INTEGER,
        productId: DataTypes.INTEGER,
        userId: DataTypes.INTEGER,
        star: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Comment',
    });
    return Comment;
};