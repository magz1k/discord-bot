module.exports = {
	name: 'admin',
	description: 'Administrative functions',
	usage: `[reload] <command name> (Reloads command)
[restart] (Restarts bot process)
[rename] (Change bot's display name)`,
	limitId: true,

	async execute(message, args) {
		return;
	},

	async reload(message, args) {
		if (args.length === 0) {
			const mod = require.cache[require.resolve('../modules/client.functions.js')];
			delete require.cache[require.resolve('../modules/client.functions.js')];
			for (let i = 0; i < mod.parent.children.length; i++) {
				if (mod.parent.children[i] === mod) {
					mod.parent.children.splice(i, 1);
					break;
				}
			}
			require('../modules/client.functions.js')(message.client);
			message.client.logger.log(`Function file was reloaded.`);
			return message.reply(`Client function file successfully reloaded.`);
		}
		commandName = args.shift().toLowerCase();
		command = message.client.commands.get(commandName) ||
			message.client.commands.find(cmd => cmd.alias && cmd.alias.includes(commandName));
		if (!command)
			return message.reply('Unable to find command');
		let response = message.client.unloadCommand(command.name);
		if (response)
			return message.reply(response);
		response = message.client.loadCommand(command.name);
		if (response)
			return message.reply(response);
		return message.reply(`Command '${command.name}' successfully reloaded.`)
	},

	async load(message, args) {
		if (args.length === 0)
			return message.reply(`You must supply a command name to load!`);
		let commandName = args.shift().toLowerCase();
		let response = message.client.loadCommand(commandName);
		if (response)
			return message.reply(response);
		return message.reply(`Command '${commandName}' successfully loaded.`)
	},

	async restart(message, args) {
		message.reply('Process restarting...');
		process.exit();
	},

	async rename(message, args) {
		message.guild.member(message.client.user).setNickname(args.join(' '));
		message.reply(`Thank you, I really like it!`);
	},

	async purge(message, args) {
		return message.reply('Disabled');
		const user = message.mentions.users.first();
		// Parse Amount
		const amount = !!parseInt(args[0]) ? parseInt(args[0]) : parseInt(args[1])
		if (!amount) return message.reply('Must specify an amount to delete!');
		if (!amount && !user) return message.reply('Must specify a user and amount, or just an amount, of messages to purge!');
		// Fetch 100 messages (will be filtered and lowered up to max amount requested)
		message.channel.fetchMessages({
			limit: 100,
		}).then((messages) => {
			if (user) {
				const filterBy = user ? user.id : Client.user.id;
				messages = messages.filter(m => m.author.id === filterBy).array().slice(0, amount);
			}
			message.channel.bulkDelete(messages).catch(error => message.client.logger.error(error.stack));
		});
	},

	async eval(message, args) {
		return message.reply('Disabled');
		const clean = text => {
			if (typeof (text) === "string")
				return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
			else
				return text;
		}

		try {
			const code = args.join(" ");
			let evaled = eval(code);

			if (typeof evaled !== "string")
				evaled = require("util").inspect(evaled);

			message.channel.send(clean(evaled), {
				code: "xl"
			});
		} catch (err) {
			message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
		}
	}
};