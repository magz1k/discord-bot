const {
	version
} = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
const os = require("os");

module.exports = {
	name: 'stats',
	description: 'Shows some useful stats about myself',
	async execute(message, args) {
		client = message.client;
		const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
		message.channel.send(`= STATISTICS =
• Bot Mem Usage  :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
• Server Usage  :: ${(os.freemem() / 1024 / 1024).toFixed(2)}/${(os.totalmem() / 1024 / 1024).toFixed(2)} MB
• Uptime     :: ${duration}
• Users      :: ${client.users.size.toLocaleString()}
• Servers    :: ${client.guilds.size.toLocaleString()}
• Channels   :: ${client.channels.size.toLocaleString()}
• Commands   :: ${client.commands.size} (${client.subcommands.size} w/ subcommands)
• Discord.js :: v${version}
• Node       :: ${process.version}`, {
			code: "asciidoc"
		});
	},
};