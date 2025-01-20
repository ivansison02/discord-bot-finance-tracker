const { SlashCommandBuilder } = require('discord.js');

const { logger } = require('../../helpers/Logger.js');
const { Budget } = require('../../database/functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add-budget')
		.setDescription('Add new budget!')
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
					{ name: 'Investment', value: 'investment' },
					{ name: 'Insurance', value: 'insurance' },
					{ name: 'Emergency Fund', value: 'emergency_fund' },
					{ name: 'Others', value: 'others' },
				)
				.setRequired(true))
		.addStringOption(option =>
			option
				.setName('amount')
				.setDescription('Amount of budget')
				.setRequired(true))
		.addStringOption(option =>
			option
				.setName('type')
				.setDescription('Type of budget')
				.addChoices(
					{ name: 'Needs', value: 'needs' },
					{ name: 'Savings', value: 'savings' },
					{ name: 'Wants', value: 'wants' },
				)
				.setRequired(false)),
	async execute(interaction) {
		try {
			const user = interaction.user.username
			const name = interaction.options.getString('name')
			const storedBudget = await Budget.findAll({ where: { user_id: user, name } })

			if (storedBudget.length > 0) {
				logger('Already has budget')
				await interaction.reply('Failed to add budget!')
				return
			}

			const item = await Budget.create({ 
				name: interaction.options.getString('name'),
                amount: interaction.options.getString('amount'),
				description: interaction.options.getString('description') ?? '',
				type: interaction.options.getString('type') ?? 'wants',
				user_id: user
			});

			logger(`Added budget: ${item.name}`)
			await interaction.reply(`Successfully added ${item.name}!`);
		} catch (error) {
			logger(`err add-budget: ${error}`)
			await interaction.reply('Someting went wrong! Please contact dev.');
		}
	},
};