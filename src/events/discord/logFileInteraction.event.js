const { KeyvBuilder, Driver } = require('cloudlink-hv/lib/keyv');

const Discord = require('discord.js');
const fs = require('fs');

class Event {
	constructor(parent, client) {
		this.parent = parent;
		this.client = client;
		this._state = {
			options: {
				event: 'interactionCreate',
			},
			author: 'Rubens G Pirie <rubens.pirie@gmail.com> [436876982794452992]',
			maintainers: [{
				name: 'Rubens G Pirie',
				email: 'rubens.pirie@gmail.com',
				discord_id: '436876982794452992',
			}],
		};
	}

	async update(parent) {
		this._state.persist = {
			cache: (new KeyvBuilder(Driver.MemoryStore)),
		};
	}

	async post(client, chain) {
		return true;
	}

	async finally(client) {
		return true;
	}

	async pre(client) {
		return true;
	}
	async process(client, chain, interaction) {
		if (!interaction.isSelectMenu()) return;
		if (interaction.customId.startsWith('logText')) {
			if (interaction.member.id !== interaction.customId.split('|').pop()) return;
			await interaction.reply({ files: [ `./logs/${interaction.message.channel.parentId}-CATEGORY/${interaction.channelId}-TEXT/${interaction.values[0]}` ] });
			return await interaction.message.delete();
		}
		else if (interaction.customId.startsWith('logCustomTXT')) {
			if (interaction.member.id !== interaction.customId.split('|').pop()) return;
			await interaction.reply({ files: [ `./logs/${interaction.customId.split('|')[1]}-CATEGORY/${interaction.customId.split('|')[2]}-TEXT/${interaction.values[0]}` ] });
			return await interaction.message.delete();
		}
		else if (interaction.customId.startsWith('logCustomVC')) {
			if (interaction.member.id !== interaction.customId.split('|').pop()) return;
			await interaction.reply({ files: [ `./logs/${interaction.customId.split('|')[1]}-CATEGORY/${interaction.customId.split('|')[2]}-VC/${interaction.values[0]}` ] });
			return await interaction.message.delete();
		}
	}
}

module.exports = {
	Event,
};
