const { oneLine } = require('common-tags');
const Discord = require('discord.js');
const fetch = require('node-fetch');

class Command {
	constructor(parent, client) {
		this.parent = parent;
		this.client = client;
		this._state = {
			triggers: ['test'],
			description: oneLine`
			Testing command!`,
			options: {
				permissions: {
					roles: [],
					users: [],
				},
				restrictions: {
					unstable: false,
					hidden: false,
					dangerous: false,
				},
			},
			examples: ['joke'],
			author: 'Rubens G Pirie <rubens.pirie@gmail.com> [436876982794452992]',
			maintainers: [{
				name: 'Rubens G Pirie',
				email: 'rubens.pirie@gmail.com',
				discord_id: '436876982794452992',
			}],
		};
	}

	async pre(client, message, args) {
		// const [Commands] = await client.database.models.Commands.findOrCreate({
		// 	where: {
		// 		GuildId: message.guild.id,
		// 		command_name: this._state.triggers[0],
		// 	},
		// });
		return true;
	}

	async register(slashInstance) {
		const data = new slashInstance()
			.setName('test')
			.setDescription('testing');

		return data;
	}

	async post(client, chain, message) {
		return true;
	}

	async finally(client, chain, message) {
		return true;
	}

	async execute(client, chain, message, args) {
		return true;
	}

	async slash(client, interaction) {
		const colours = ['DEFAULT', 'AQUA', 'DARK_AQUA', 'GREEN', 'DARK_GREEN', 'BLUE', 'DARK_BLUE', 'PURPLE', 'DARK_PURPLE', 'LUMINOUS_VIVID_PINK', 'DARK_VIVID_PINK', 'GOLD', 'DARK_GOLD', 'ORANGE', 'DARK_ORANGE', 'RED', 'DARK_RED', 'GREY', 'DARKER_GREY', 'LIGHT_GREY', 'NAVY', 'DARL_NAVY', 'DARK_NAVY', 'YELLOW'];


		for (const color of colours) {
			const embed = new Discord.MessageEmbed()
				.setTitle(color)
				.setColor(color);

			interaction.channel.send({ embeds: [ embed ] });
		}


		// const embed = new Discord.MessageEmbed()
		// 	.setTitle('test')
		// 	.setColor(colours[Math.floor(Math.random() * colours.length)]);

		// interaction.reply({ embeds: [ embed ] });
	}

}

module.exports = {
	Command,
};
