const { SlashCommandBuilder } = require('discord.js');

const { logger } = require('../../helpers/Logger.js');
const { Expenses } = require('../../database/functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add-expense')
		.setDescription('Add new log to expenses!')
		.addStringOption(option =>
			option
				.setName('name')
				.setDescription('Expense')
				.addChoices(
					{ name: 'Groceries', value: 'groceries' },
					{ name: 'Rent', value: 'rent' },
					{ name: 'Transportation', value: 'transportation' },
					{ name: 'Bill', value: 'bill' },
					{ name: 'Medicine', value: 'medicine' },
					{ name: 'Subscription', value: 'subscription' },
					{ name: 'Technology', value: 'technology' },
					{ name: 'Parents', value: 'parents' },
					{ name: 'Date', value: 'date' },
					{ name: 'Others', value: 'others' },
				)
				.setRequired(true))
		.addStringOption(option =>
			option
				.setName('amount')
				.setDescription('Amount of expense')
				.setRequired(true))
		.addStringOption(option =>
			option
				.setName('description')
				.setDescription('Description of the expense')
				.setRequired(false))
		.addStringOption(option =>
			option
				.setName('payment_method')
				.setDescription('Mode of payment')
				.addChoices(
					{ name: 'Credit Card', value: 'creditCard' },
					{ name: 'Cash', value: 'cash' },
					{ name: 'E-Wallet', value: 'ewallet' },
				)
				.setRequired(false))
		.addStringOption(option =>
			option
				.setName('date')
				.setDescription('Date of expense')
				.setRequired(false)),
	async execute(interaction) {
		try {
			const item = await Expenses.create({ amount: interaction.options.getString('amount'),
				date: interaction.options.getString('date') ?? '', // TODO
				name: interaction.options.getString('name'),
				description: interaction.options.getString('description') ?? '',
				payment_method: interaction.options.getString('payment-method') ?? 'cash',
				user_id: interaction.user.username
			});
			
			await interaction.reply(`Successfully added ${item.name}!`);
		} catch (error) {
			logger(`err add-expense: ${error}`)
			await interaction.reply('Someting went wrong! Please contact dev.');
		}
	},
};