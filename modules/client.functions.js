module.exports = (client) => {

    client.logger = require('./Logger');

    client.loadCommand = (commandName) => {
        try {
            const command = require(`../commands/${commandName}`);
            client.commands.set(command.name, command);
            const subcommands = Object.getOwnPropertyNames(command).filter(name => typeof command[name] === 'function');
            if (subcommands.length > 1)
                client.subcommands.set(command.name, subcommands);
            client.logger.log(`Command '${commandName}' was loaded.`);
            return false;
        } catch (e) {
            return `Unable to load command ${commandName}: ${e}`;
        }
    };

    client.unloadCommand = (commandName) => {
        let command = client.commands.get(commandName);
        if (!command)
            return `The command '${commandName}' doesn't seem to exist!`;
        const mod = require.cache[require.resolve(`../commands/${command.name}`)];
        delete require.cache[require.resolve(`../commands/${command.name}.js`)];
        client.commands.delete(command.name);
        client.subcommands.delete(command.name);
        for (let i = 0; i < mod.parent.children.length; i++) {
            if (mod.parent.children[i] === mod) {
                mod.parent.children.splice(i, 1);
                break;
            }
        }
        client.logger.log(`Command '${commandName}' was unloaded.`);
        return false;
    };

    client.getResponse = async (message, question, limit = 60000) => {
        const filter = m => m.author.id === message.author.id

        await message.channel.send(question);

        try {
            const collected = await message.channel.awaitMessages(filter, {
                max: 1,
                time: limit,
                errors: ["time"]
            });
            return collected.first().content;
        } catch (e) {
            return client.logger.error(e.message);
        }
    };

    client.getMenuResponse = async (message, question, responses, limit = 60000) => {
        const filter = m => {
            const option = Number.parseInt(m.content.charAt(0));
            return m.author.id === message.author.id &&
                option &&
                responses.length >= option;
        };
        const data = [];
        data.push('_You must select a number_');
        data.push(question);
        data.push(``);
        responses.forEach((response, index) => {
            data.push(`Option ${index+1}: ${response}`);
        });
        await message.channel.send(data);

        try {
            const collected = await message.channel.awaitMessages(filter, {
                max: 1,
                time: limit,
                errors: ["time"]
            });
            return Number.parseInt(collected.first().content.charAt(0)) - 1;
        } catch (e) {
            return client.logger.error(e.message);
        }
    };
}