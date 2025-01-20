const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, REST, Routes } = require('discord.js');

const { clientId, guildId, token } = require('./config.json');
const { logger } = require('./helpers/Logger.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent] });

client.commands = new Collection();
const commands = [];

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
			commands.push(command.data.toJSON());
		} else {
			logger(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`)
		}
	}
}

const rest = new REST().setToken(token);

(async () => {
	try {
		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		logger(`Successfully reloaded ${data.length} application (/) commands.`)
	} catch (error) {
		logger(`Deploying commands error: ${error}`)
		console.error('error: ', error);
	}
})();

client.once(Events.ClientReady, async readyClient => {
	logger(`Ready! Logged in as ${readyClient.user.tag}`)
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return

	const command = interaction.client.commands.get(interaction.commandName)

	if (!command) {
		logger(`No command matching ${interaction.commandName} was found.`)
		return
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		logger(`Fetching commands error: ${error}`)
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		}
	}
});

client.login(token);