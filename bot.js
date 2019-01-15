const {
	Client,
	Collection
} = require('discord.js');
const fs = require('fs');

//Set up client variable
const client = new Client();
client.config = require('./storage/config');
client.blizzard = require('./modules/blizzard');
client.youtube = require('./modules/youtube');
client.youtube.queue = new Collection()
client.commands = new Collection();
client.subcommands = new Collection();
client.cooldowns = new Collection();
require('./modules/client.functions')(client);

//Have to wrap the bot in an async function to do some of the weird async/await stuff
const init = async () => {
	//Command handler
	const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
	client.logger.log(`Loading a total of ${commandFiles.length} events.`);
	commandFiles.forEach(file => {
		const response = client.loadCommand(file);
		if (response) client.logger.log(response);
	});
	//Event handler
	const eventFiles = fs.readdirSync('./events/');
	client.logger.log(`Loading a total of ${eventFiles.length} events.`);
	eventFiles.forEach(file => {
		const eventName = file.split('.')[0];
		client.logger.log(`Loading Event: ${eventName}`);
		const event = require(`./events/${file}`);
		client.on(eventName, event.bind(null, client));
	});



	process.on('unhandledRejection', error => client.logger.error(error.message));

	client.on('error', error => client.logger.error(error.message));

	client.login(client.config.token);
};

init();