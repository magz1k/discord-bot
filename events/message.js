const {
    Collection
} = require('discord.js');

module.exports = async (client, message) => {
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|\\${client.config.prefix})\\s*`);
    if (message.author.bot || !prefixRegex.test(message.content)) return;

    const [, matchedPrefix] = message.content.match(prefixRegex);
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName) ||
        client.commands.find(cmd => cmd.alias && cmd.alias.includes(commandName));

    if (!command) return;

    const subcommands = client.subcommands.get(command.name);

    if (command.limitId && !client.config.admins.includes(message.author.id)) {
        return message.reply(`You don't have access to that command.`);
    }

    if (command.guildOnly && message.channel.type !== 'text') {
        return message.reply(`This command can't be used in private chat.`);
    }

    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`
        if (command.usage) {
            reply += `\nThe proper usage would be: \`${client.config.prefix}${command.name} ${command.usage}\``;
        }
        return message.channel.send(reply);
    }

    if (!client.cooldowns.has(command.name)) {
        client.cooldowns.set(command.name, new Collection())
    }

    const now = Date.now();
    const timestamps = client.cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || client.config.defaultCooldown) * 1000;

    if (!timestamps.has(message.author.id)) {
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    } else {
        const expireTime = timestamps.get(message.author.id) + cooldownAmount;

        if(now < expireTime) {
            const timeLeft = (expireTime - now) / 1000;
            return message.reply(`You can use that command in ${timeLeft.toFixed(1)} more second(s).`)
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }

    try {
        if (subcommands !== undefined && subcommands.includes(args[0]))
            command[args.shift()](message, args);
        else
            command.execute(message, args);
    } catch (err) {
        client.logger.error(err.message);
        message.reply('There was an error trying to execute your command. Please try again later');
    }
};