'use strict';

const { sequelize } = require("../models");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Vouchers', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.INTEGER,
                autoIncrement: true,
            },
            fromDate: {
                type: Sequelize.STRING
            },
            toDate: {
                type: Sequelize.STRING
            },
            typeVoucherId: {
                type: Sequelize.INTEGER
            },
            number: {
                type: Sequelize.INTEGER
            },
            numberUsed: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            codeVoucher: {
                type: Sequelize.STRING
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
        await queryInterface.dropTable('Vouchers');
    }
};