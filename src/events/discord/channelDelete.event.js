const { KeyvBuilder, Driver } = require('cloudlink-hv/lib/keyv');

const Discord = require('discord.js');

class Event {
	constructor(parent, client) {
		this.parent = parent;
		this.client = client;
		this._state = {
			options: {
				event: 'channelDelete',
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
		const parent = channel.guild.channels.cache.get(channel.parentId);

		const logEmbed = new Discord.MessageEmbed()
			.setColor('PURPLE')
			.setAuthor(channel.guild.name, channel.guild.iconURL({ dynamic: true }))
			.setTitle('Channel Update: `DELETED`')
			.setDescription(`#${channel.name} was **deleted** under the category **${!parent ? 'None' : parent.name}**.`)
			.addField('Channel ID', channel.id)
			.addField('Channel Name', channel.name)
			.addField('Channel Type', channel.type)
			.setTimestamp();

		client.guilds.cache.get(process.env.GUILD).channels.cache.get(process.env.LOG_CHANNEL).send({ embeds: [logEmbed ] }).catch(e => { client.logger.error('[EMBED SEND ERROR]', e); });

		return true;
	}
}

module.exports = {
	Event,
};
