const { KeyvBuilder, Driver } = require('cloudlink-hv/lib/keyv');

const Discord = require('discord.js');

class Event {
	constructor(parent, client) {
		this.parent = parent;
		this.client = client;
		this._state = {
			options: {
				event: 'channelCreate',
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

		if (channel.type === 'GUILD_TEXT') {
			const logEmbed = new Discord.MessageEmbed()
				.setColor('PURPLE')
				.setAuthor(channel.guild.name, channel.guild.iconURL({ dynamic: true }))
				.setTitle('Channel Update: `CREATED`')
				.setDescription(`<#${channel.id}> was **created** under the category **${!parent ? 'None' : parent.name}**.`)
				.addField('Channel ID', channel.id, true)
				.addField('Channel Name', channel.name, true)
				.addField('Channel Topic', !channel.topic ? 'None' : channel.topic, true)
				.addField('Channel Type', channel.type, true)
				.addField('Channel Link', `<#${channel.id}>`, true)
				.setTimestamp();

			return client.guilds.cache.get(process.env.GUILD).channels.cache.get(process.env.LOG_CHANNEL).send({ embeds: [logEmbed ] }).catch(e => { client.logger.error('[EMBED SEND ERROR]', e); });
		}
		else {
			const logEmbed = new Discord.MessageEmbed()
				.setColor('PURPLE')
				.setAuthor(channel.guild.name, channel.guild.iconURL({ dynamic: true }))
				.setTitle('Channel Update: `CREATED`')
				.setDescription(`<#${channel.id}> was **created** under the category **${!parent ? 'None' : parent.name}**.`)
				.addField('Channel ID', channel.id, true)
				.addField('Channel Name', channel.name, true)
				.addField('\u200B', '\u200B', true)
				.addField('Channel Type', channel.type, true)
				.addField('Channel Link', `<#${channel.id}>`, true)
				.setTimestamp();

			return client.guilds.cache.get(process.env.GUILD).channels.cache.get(process.env.LOG_CHANNEL).send({ embeds: [logEmbed ] }).catch(e => { client.logger.error('[EMBED SEND ERROR]', e); });
		}

	}
}

module.exports = {
	Event,
};
