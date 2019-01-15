const fs = require('fs');

module.exports = {
	name: 'wowinfo',
	description: 'Provides **current** guild information. (or as much as I know!)',
	//alias: ['guild', 'guildinfo', 'ginfo'],
	usage: '[key] [value]\n**Keys**: name, guild_leader, guild_desc, guild_server',
	guildOnly: true,

	async execute(message, args) {
		const guildFile = './storage/guild_info.json';
		let guildInfo = JSON.parse(fs.readFileSync(guildFile));
		//Read guild information
		if (args.length === 0) {
			return message.channel.send({
				embed: {
					author: {
						name: `${guildInfo.name}`,
						icon_url: `https://images-ext-1.discordapp.net/external/LpUzQ3muzYu-vq3tbcjq1wcMuiWTXVWgfp5xLN3JwSA/https/i.pinimg.com/originals/1d/4c/bb/1d4cbbceeb457bc861dcab0c4e721b1a.jpg`
					},
					color: 0x8C1616,
					fields: [{
							name: `**Server Name**`,
							value: `Suramar/Draka`
						},
						{
							name: `**Guild Leader**`,
							value: `${guildInfo.guild_leader}`
						},
						{
							name: `**Guild Description**`,
							value: `${guildInfo.guild_desc}`
						}
					],
					timestamp: guildInfo.last_updated
				}
			});
		}
		//Check for second command
		if (args.length !== 0 && message.guild.member(message.author.id).roles.exists('name', 'Plus')) {

			key = args.shift().toLowerCase();
			value = args.join(` `);
			guildInfo[key] = value;
			guildInfo["last_updated"] = new Date();
			let data = JSON.stringify(guildInfo, null, 3);
			fs.writeFile(guildFile, data, (err) => {
				if (err) console.log(err);
				console.log('Guild information updated');
				return message.reply(`Guild information was updated. (${key} => ${value})`);
			});
		} else {
			return message.reply(`I don't think you're allowed to do that.`);
		}
	},
};