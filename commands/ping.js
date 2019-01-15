module.exports = {
	name: 'ping',
	description: 'Determine latency between user->server and bot->server',
	alias: ['pong'],

	async execute(message, args) {
		message.delete().catch(O_o => {});
		const m = await message.channel.send("Ping?");
		m.edit(`Pong! ${message.author}, your latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(message.client.ping)}ms`);
	},
};