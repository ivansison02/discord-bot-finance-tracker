const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Budget = require('../models/Budget.js')(sequelize, Sequelize.DataTypes)
const Expenses = require('../models/Expense.js')(sequelize, Sequelize.DataTypes)
const Savings = require('../models/Saving.js')(sequelize, Sequelize.DataTypes)

/* Reflect.defineProperty(Expenses.prototype, 'addExpense', {
	/* eslint-disable-next-line func-name-matching */
	/*value: async function addExpense(item) {
		return Expenses.create({ item });
	},
});

Reflect.defineProperty(Expenses.prototype, 'getExpenses', {
	/* eslint-disable-next-line func-name-matching */
	/*value: function getExpenses() {
		return Expenses.findAll({
			where: { user_id: this.user_id },
			include: ['item'],
		});
	},
});*/

module.exports = { Budget, Expenses, Savings };