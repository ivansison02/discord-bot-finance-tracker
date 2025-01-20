const Sequelize = require('sequelize');

const { logger } = require('../helpers/Logger.js');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Budget = require('../models/Budget.js')(sequelize, Sequelize.DataTypes);
const Expense = require('../models/Expense.js')(sequelize, Sequelize.DataTypes);
const Saving = require('../models/Saving.js')(sequelize, Sequelize.DataTypes);

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => {
	// If for some reason table is not created, try to init with upserting to table.
	/* const budget = [
		Budget.upsert({ name: 'sample', amount: 0 }),
	];
	const expense = [
		Expense.upsert({ name: 'sample', amount: 0 }),
	];
	const savings = [
		Saving.upsert({ name: 'sample', amount: 0 }),
	];

	await Promise.all(budget, expense, savings);*/
	logger('Database synced')

	sequelize.close();
}).catch((error) => {
	logger(error)
});