var nodemailer = require('nodemailer');

module.exports = {
	name: 'invite',
	description: 'Creates an invite to the server and emails the user',
	alias: ['party'],
	args: true,
	guildOnly: true,
	usage: '[email]',

	async execute(message, args) {
		const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g;
		const sendTo = args.shift();
		if (sendTo.match(emailRegex)) {
			var transporter = nodemailer.createTransport({
				service: `gmail`,
				auth: {
					user: `noobplusplus@gmail.com`,
					pass: `Msioy;5731`
				}
			});
			const mailOptions = {
				from: `noobplusplus@gmail.com`,
				to: `${sendTo}`,
				subject: `Join our guild Discord server!`,
				html: `Hello, it's your friendly neighborhood automaton!
				<br />I was told to go ahead and send you an <a href='https://discord.gg/q8xtKgF'>invite link</a> to our server, I hope you don't mind!
				<br />Hope to see you soon!
				<br /><br /><br />Sincerely,<br />${message.guild.member(message.client.user).displayName}`
			};
			transporter.sendMail(mailOptions, function (err, info) {
				if (err)
					return message.reply(`Failed to send an invite email to ${sendTo}!\n${err}`);
				else
					return message.reply(`Successfully sent an invite email to ${sendTo}!\n`);
			});
		} else {
			message.reply(`${sendTo} is not a valid email!`);
		}
	},
};