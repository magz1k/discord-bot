const request = require('request-promise');
const {
	RichEmbed
} = require('discord.js');

module.exports = {
	name: 'raider',
	description: 'Raider.IO API',
	alias: ['raiderio', 'raid', 'rio'],
	args: true,
	usage: '[type] <tags>\nType "guild" <raid_progression|raid_rankings>\nType "character" <gear|guild|raid_progression|raid_achievement_meta>',

	async execute(message, args) {
		return message.reply("Invalid input");
	},

	async guild(message, args) {
		let guildUrl = `https://raider.io/api/v1/guilds/profile?region=us&realm=suramar&name=Hold%20My%20Brewski`;
		if (args.length === 1) guildUrl += `&fields=${args[0]}`;
		request.get(guildUrl, function (err, res, body) {
			if (err) return message.reply(err);
			const json = JSON.parse(body);
			if (json.error) return message.reply(json.message);
			return message.channel.send(`Here is the information you requested`, {
				embed: {
					author: {
						icon_url: `https://images-ext-1.discordapp.net/external/LpUzQ3muzYu-vq3tbcjq1wcMuiWTXVWgfp5xLN3JwSA/https/i.pinimg.com/originals/1d/4c/bb/1d4cbbceeb457bc861dcab0c4e721b1a.jpg`
					},
					color: 0x8C1616,
					fields: [{
						name: `**Guild Information**`,
						value: `[${json.name}](${json.profile_url}) is a ${json.faction} guild in the ${json.region} region on ${json.realm}`
					}, ],
					timestamp: new Date()
				}
			});
		})
	},

	async character(message, args) {
		if (args.length === 0)
			return message.reply('Character lookup requires a name!');
		
		const factionSpecific= {
			horde: {
				color: [140, 22, 22],
				icon: 'https://d1u5p3l4wpay3k.cloudfront.net/wowpedia/4/4f/Horde_32.png?version=f33d510462c777a575c0f24df2185361'
			},
			alliance: {
				color: [20, 69, 135],
				icon: 'https://d1u5p3l4wpay3k.cloudfront.net/wowpedia/2/25/Alliance_32.png?version=4eaf2bb6e3746c63e560737af4469afc'
			}
		}
		let realm = message.client.config.defaultRealm;
		let charName = args.shift();

		if (charName.indexOf(`-`) !== -1)
			[charName, realm] = charName.split(/-(.+)/);

		let charUrl = `https://raider.io/api/v1/characters/profile?region=us&realm=${realm}&name=${encodeURIComponent(charName)}`;
		if (args.length === 1)
			charUrl += `&fields=${args[0]}`;

		await request({
				uri: `https://raider.io/api/v1/characters/profile`,
				json: true,
				qs: {
					region: 'us',
					realm: realm,
					name: encodeURIComponent(charName),
					fields: ['gear', 'guild', 'raid_progression', 'mythic_plus_scores', 'mythic_plus_ranks', 'mythic_plus_recent_runs', 'mythic_plus_best_runs'].join(',')
				}
			})
			.then(async (response) => {
				if (response.error)
					return message.reply(json.message);
				if (response.error)
					return message.client.logger.error(response.error_description);
				
				const embed = new RichEmbed()
					.setAuthor(`${response.name} of ${response.realm}(${response.region})`, factionSpecific[response.faction].icon, response.profile_url)
					.setThumbnail(response.thumbnail_url)
					.setColor(factionSpecific[response.faction].color)
					.setTimestamp(new Date())
					.addField(`**General Information**`,
						`${response.gender.charAt(0).toUpperCase() + response.gender.substr(1)} ${response.race} ${response.active_spec_name} ${response.class} (${response.active_spec_role})\nFights for ${response.guild.name}`)
					.addField(`**Gear Information**`, `${response.gear.item_level_equipped}/${response.gear.item_level_total} (Artifact: ${response.gear.artifact_traits})`, true)
					.addField(`**Honorable Kills**`, response.honorable_kills, true)
					.addField(`**Achievement Points**`, response.achievement_points, true)
					.addField(`**Mythic+ Scores`, 
						`All: ${response.mythic_plus_scores.all}\nTank: ${response.mythic_plus_scores.tank}\nHealer: ${response.mythic_plus_scores.healer}\nDPS: ${response.mythic_plus_scores.dps}`, true)

					return message.channel.send('Here is the information you requested', { embed: embed});

			})
			.catch(e => message.client.logger.error(e.message))

		/* 
			return message.channel.send(`Here is the information you requested`, {
				
					
						{
							name: `**Achievement Points**`,
							value: `${json.achievement_points}`,
							inline: true
						},
						{
							name: `**Honorable Kills**`,
							value: `${json.honorable_kills}`,
							inline: true
						},
						{
							name: `**Additional Information**`,
							value: JSON.stringify(json, (n, v) => {
								if (["region", "honorable_kills", "realm", "achievement_points", "faction", "name", "profile_url", "thumbnail_url", "gender", "race", "active_spec_name", "class", "active_spec_role"].includes(n)) return undefined;
								else return v
							}, 2)
						}
					],
					timestamp: new Date()
				}
			});
		})*/
	},
};