const flip = require('flip-text');
module.exports = {
	name: 'flip',
	description: 'Flips a coin; heads or tails?',
	alias: ['quarter'],

	async execute(message, args) {
		message.delete().catch(O_o => {});
		if (args.length !== 0) {
			const filter = /\(([^)]+)\)/g;
			const string = args.join(' ');
			var matches = filter.exec(string);
			return message.reply(`(╯°□°）╯︵ ${string.replace(filter, match => flip(match.replace(/[{()}]/g, '')))}`);
			//return message.reply(`(╯°□°）╯︵ ${flip(args.join(' '))}`)
		}
		let outcomes = ['heads', 'tails'];
		let outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
		message.channel.send(`You flipped a coin... it was ${outcome}!`);
	},
};