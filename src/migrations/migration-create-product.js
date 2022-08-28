'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Products', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING
            },
            statusId: {
                type: Sequelize.STRING
            },
            categoryId: {
                type: Sequelize.STRING
            },
            brandId: {
                type: Sequelize.STRING
            },
            warrantyId: {
                type: Sequelize.STRING
            },
            origin: {
                type: Sequelize.STRING
            },
            material: {
                type: Sequelize.STRING
            },
            view: {
                type: Sequelize.INTEGER
            },
            shortDes: {
                type: Sequelize.TEXT('long')
            },
            long: {
                type: Sequelize.STRING
            },
            width: {
                type: Sequelize.STRING
            },
            height: {
                type: Sequelize.STRING
            },
            weight: {
                type: Sequelize.STRING
            },
            stock: {
                type: Sequelize.INTEGER
            },
            count: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            nameDetail: {
                type: Sequelize.STRING
            },
            originalPrice: {
                type: Sequelize.BIGINT
            },
            percentDiscount: {
                type: Sequelize.INTEGER
            },
            discountPrice: {
                type: Sequelize.BIGINT
            },
            desHTML: {
                type: Sequelize.TEXT('long')
            },
            desMarkdown: {
                type: Sequelize.TEXT('long')
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Products');
    }
};