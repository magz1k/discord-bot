const db = require('better-sqlite3')('./storage/guild_config.db');

module.exports = {
	name: 'test',
	description: 'This command is only used for testing purposes. It serves no use, other than to beta new features',
	limitId: true,

	async execute(message, args) {
		const response = await message.client.getResponse(message, "How are you")
			.then(x => message.reply(x))
			.catch(e => message.client.logger.error(e.message));
	},

	async test(message, args) {
		let testargs = [`Demon Spawn (Cats)`, `Doggos (puppers)`, `Danger Noodle (Snek)`, `Furry Danger Noodle (Ferret)`, `An Earthworm`];
		const response = await message.client.getMenuResponse(message, "What's your favorite type of animal? (**MENU TEST**)", testargs);

		if (response !== undefined)
			message.reply(`Your response was ${testargs[response]}`);
		else
			message.reply(`Something happened`);
	},

	async demo(message, args) {
		command = args.shift().toLowerCase();
		if (command === 'get') {
			const row = db.prepare('SELECT * FROM test WHERE rowId=?').get(args[0]);
			message.client.logger.log(`${row.test_name} + ${row.test_field}`);
		} else if (command === 'set') {
			const row = db.prepare("INSERT OR REPLACE INTO test (test_name, test_field) VALUES (?, ?);").run(args[0], args[1]);
		} else message.reply(command)
	},


	f: {
		function (message, args) {
			message.reply('test ok');
		},
		name: 'whatever',
		othername: ['da shit', 'also shit']
	},
}