module.exports = async client => {
    client.logger.log(`Logged in as ${client.user.tag}!`, 'ready');
    client.user.setPresence({
        status: `online`,
        game: {
            name: "World of Warcraft",
            type: "PLAYING"
        }
    });
    client.users.get(client.config.owner).send(`I'm now available for commands.
${client.commands.size} commands loaded
${client.subcommands.size} commands w/ subcommands enabled`);
};