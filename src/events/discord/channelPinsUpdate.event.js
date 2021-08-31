const { KeyvBuilder, Driver } = require('cloudlink-hv/lib/keyv');

const Discord = require('discord.js');
const ms = require('ms');

class Event {
	constructor(parent, client) {
		this.parent = parent;
		this.client = client;
		this._state = {
			options: {
				event: 'channelPinsUpdate',
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
	async process(client, chain, channel) {
		const logEmbed = new Discord.MessageEmbed()
			.setColor('DARK_PURPLE')
			.setAuthor(channel.guild.name, channel.guild.iconURL({ dynamic: true }))
			.setTitle('Channel Update: `PINS UPDATED`')
			.setDescription(`<#${channel.id}> has had its **PINS** updated.`)
			.addField('Pin', `[Jump to Message](https://discord.com/channels/${process.env.GUILD}/${channel.id})`)
			.setTimestamp();

		client.guilds.cache.get(process.env.GUILD).channels.cache.get(process.env.LOG_CHANNEL).send({ embeds: [logEmbed ] }).catch(e => { client.logger.error('[EMBED SEND ERROR]', e); });

		return true;
	}
}

module.exports = {
	Event,
};
