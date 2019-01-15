const request = require('request');

module.exports = {
	name: 'pokemon',
	description: 'In Progress (Oct 16th 2018)',
	alias: ['poke', 'pokeapi'],
	args: true,
	usage: '[pokemon id/name]',
	limitId: true,
	async execute(message, args) {
		let pokeApiUrl = `https://pokeapi.co/api/v2/pokemon/`;
	},
};