module.exports = {
	name: 'help',
	description: 'Provides helpful command information.',
	alias: ['info', 'halp', 'commands'],
	usage: '[command name]',
	async execute(message, args) {
		const data = []
		const {
			commands
		} = message.client;

		if (!args.length) {
			data.push('Here is a list of all my current commands:');
			data.push(commands.filter(command => command.limitId && message.client.config.admins.includes(message.author.id) || !command.limitId).map(command => command.name).sort().join(', '));
			data.push(`\nYou can send \`${message.client.config.prefix}help [command]\` to get information on specific commands.`);

			return message.author.send(data, {
					split: true
				})
				.then(() => {
					if (message.channel.type === 'dm') return;
					message.reply('I went ahead and send you a private message with more command information');
				})
				.catch(error => {
					message.reply('It seems like I can\'t message you. Perhaps messages are disabled?');
				});
		}

		const name = args.shift().toLowerCase();
		const command = commands.get(name) || commands.find(c => c.alias && c.alias.includes(name));

		if (!command || (command.limitId && !message.client.config.admins.includes(message.author.id))) {
			return message.reply('That\'s not a command that I know.');
		}

		data.push(`**Name:** ${command.name}`);

		if (command.alias) data.push(`**Aliases:** ${command.alias.join(', ')}`);
		if (command.description) data.push(`**Description:** ${command.description}`);
		if (command.usage) data.push(`**Usage:** ${message.client.config.prefix}${command.name} ${command.usage}`);
		if (command.limitId) data.push(`*This command has limited authorization*`);

		message.channel.send(data, {
			split: true
		});
	},
};