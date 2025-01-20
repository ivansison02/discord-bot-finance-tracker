const { SlashCommandBuilder } = require('discord.js');

const { logger } = require('../../helpers/Logger.js');
const { Savings } = require('../../database/functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add-saving')
		.setDescription('Add new budget!')
		.addStringOption(option =>
			option
				.setName('name')
				.setDescription('Name')
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
			const item = await Savings.create({ amount: interaction.options.getString('amount'),
				name: interaction.options.getString('name'),
				description: interaction.options.getString('description') ?? '',
				type: interaction.options.getString('type') ?? 'wants',
				user_id: interaction.user.username
			});

			await interaction.reply(`Successfully added ${item.name}!`);
		} catch (error) {
			logger(`err add-saving: ${error}`)
			await interaction.reply('Someting went wrong! Please contact dev.');
		}
	},
};