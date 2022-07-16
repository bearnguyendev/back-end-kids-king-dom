'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Blog extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Blog.belongsTo(models.Allcode, { foreignKey: 'subjectId', targetKey: 'keyMap', as: 'subjectData' })
        }
    };
    Blog.init({
        title: DataTypes.STRING,
        statusId: DataTypes.STRING,
        shortDes: DataTypes.TEXT('long'),
        subjectId: DataTypes.STRING,
        image: DataTypes.BLOB('long'),
        contentMarkdown: DataTypes.TEXT('long'),
        contentHTML: DataTypes.TEXT('long')
    }, {
        sequelize,
        modelName: 'Blog',
    });
    return Blog;
};