const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { find, map, reduce } = require('lodash')
const { Op } = require('sequelize');
const moment = require('moment');

const { logger } = require('../../helpers/Logger.js');
const { formatAmount } = require('../../helpers/Amount.js');
const { Budget, Expenses } = require('../../database/functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('generate-report')
		.setDescription('Generate!')
		.addUserOption(option => 
			option
				.setName('owner')
				.setDescription('Expense of whom')
				.setRequired(false)
		)
		.addStringOption(option =>
			option
				.setName('monthly')
				.setDescription('Month of the year')
				.addChoices(
					{ name: 'January', value: '01' },
					{ name: 'February', value: '02' },
					{ name: 'March', value: '03' },
					{ name: 'April', value: '04' },
					{ name: 'May', value: '05' },
					{ name: 'June', value: '06' },
					{ name: 'July', value: '07' },
					{ name: 'August', value: '08' },
					{ name: 'September', value: '09' },
					{ name: 'October', value: '10' },
					{ name: 'November', value: '11' },
					{ name: 'December', value: '12' },
				)
				.setRequired(false)),
	async execute(interaction) {
		try {
			const user = interaction.options.getUser('owner')?.username ?? interaction.user.username
			const monthly = interaction.options.getString('monthly') ?? (new Date().getMonth() + 1).toString().padStart(2, '0')
			const startDate = `${new Date().getFullYear()}-${monthly}-01`
			const endDate = `${new Date().getFullYear()}-${monthly}-31`

			logger(`Generating report of ${user} on date ${startDate} till ${endDate}`)

			const storedExpenses = await Expenses.findAll({ where: { 
				user_id: user, 
				createdAt: { 
					[Op.between]: 
						[
							new Date(startDate), new Date(endDate)
						] 
					} 
				} 
			})
			
			let combinedExpenses = reduce(storedExpenses, (list, item) => {
				list[item.name] ? list[item.name] = {...item, amount: list[item.name].amount + item.amount } : list[item.name] = item;
				return list;
			}, {});
			
			const formattedExpenses = map(combinedExpenses, (expense) => {
				return {	
					name: expense.name ? expense.name : expense.dataValues.name,
					amount: expense.amount
				}
			})

			const storedBudget = await Budget.findAll({ where: { user_id: user } })
			
			const report = map(formattedExpenses, (expense) => {
				const budget = find(storedBudget, (budget) => 
					budget.name === expense.name
				)?.amount ?? 0

				const formattedExpense = formatAmount(expense.amount)
				const formattedBudget = formatAmount(budget)

				const remaningBalance = budget - expense.amount
				const balanceStatus = remaningBalance < 0 ? 'Outstanding Balance' : 'Remaining Balance'
				const formattedRemainingBalance = formatAmount(remaningBalance)

				return {
					name: `${expense.name.toUpperCase()}`,
					value: `Total Expenses: ${formattedExpense} out of ${formattedBudget}\n${balanceStatus}: ${formattedRemainingBalance}`
				}
			})
			
			if (report.length == 0) {
				logger(`No available report`)
				await interaction.reply('No available report');
				return
			}

			logger(`report: ${JSON.stringify(report)}`)

			const embed = new EmbedBuilder()
				.setColor(0x0099FF)
				.setTitle(`${moment(new Date()).format('MMMM')} Report`)
				.addFields(report)
				.setTimestamp()

			await interaction.reply('Generating report, please wait...');
			await interaction.channel.send({ embeds: [embed] });
		} catch (error) {
			logger(`err generate-report: ${error}`)
			await interaction.reply('Someting went wrong! Please contact dev.');
		}
	},
};