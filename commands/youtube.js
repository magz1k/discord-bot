module.exports = {
	name: 'youtube',
	description: 'This command is only used for testing purposes. It serves no use, other than to beta new features',
	alias: ['play', 'yt', 'audio'],
	usage: `[no args] (Gives current information + queue)
[play] (starts queue)
[pause] (pauses stream)
[add] <youtube url>(adds url to queue)
[setvol] (Sets current volume limit 1-100)`,
	guildOnly: true,

	async execute(message, args) {
		const nowPlaying = await message.client.youtube.getInfo(message);
		if (!nowPlaying)
			return message.reply(`No music currently playing`);
		return message.channel.send({embed: nowPlaying});
	},

	async add(message, args) {
		const response = await message.client.youtube.addSong(message, args[0]);
		if (response === false)
			message.reply('Failed to add song. Invalid URL?');
		message.delete();
		message.reply(`${response} was added to the queue!`);
	},

	async play(message, args) {
		const {
			voiceChannel
		} = message.member;

		if (!voiceChannel)
			return message.reply(`You aren't in an available voice channel!`);
		
		const response = await message.client.youtube.play(message);
		if (response === false)
			message.reply('error');
	},

	async pause(message, args) {
		const voiceConnection = message.client.voiceConnections.find(val => val.channel.guild.id == message.guild.id);

		if (!voiceConnection) return;
		voiceConnection.dispatcher.pause();
	},

	async resume(message, args) {
		const voiceConnection = message.client.voiceConnections.find(val => val.channel.guild.id == message.guild.id);

		if (!voiceConnection) return;
		voiceConnection.dispatcher.resume();
	},

	async setvol(message, args) {
		const voiceConnection = message.client.voiceConnections.find(val => val.channel.guild.id == message.guild.id);

		if (!voiceConnection) return;

		vol = Number.parseInt(args.shift());

		if (Number.isNaN(vol))
			return message.reply('Invalid input: Volume NaN');
		if (vol < 1 || vol > 100)
			return message.reply('Invalid input: Value must be between 0 and 100');
		vol = vol / 100;
		voiceConnection.dispatcher.setVolume(vol);
		message.reply(`Volume level was changed!`);
	}
};