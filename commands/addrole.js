module.exports = {
	name: 'addrole',
	description: 'Used to assign role to a user',
	alias: ['roleadd', 'ra'],
	args: true,
	limitId: true,
	usage: '[@User] [role]',
	
	async execute(message, args) {
		if (args.length !== 2)
		{
			return message.reply(`Could not modify user, invalid input`);
		}
		const role = message.guild.roles.find("name", args[1]);
		const member = message.mentions.members.first();
		
		if (!role) return message.reply(`Could not modify ${member}, invalid role`);
		if (!member) return message.reply(`Could not modify ${member}, invalid member`);
		
		member.addRole(role);
		message.reply(`I successfully added ${member} to ${role}!`);
	},
};