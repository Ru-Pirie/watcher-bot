const { KeyvBuilder, Driver } = require('cloudlink-hv/lib/keyv');

const Discord = require('discord.js');

class Event {
	constructor(parent, client) {
		this.parent = parent;
		this.client = client;
		this._state = {
			options: {
				event: 'messageDelete',
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
	async process(client, chain, message) {
		const logEmbed = new Discord.MessageEmbed()
			.setColor('DARK_ORANGE')
			.setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }))
			.setTitle('Message Update: `DELETED`')
			.setDescription(`Message by <@${message.author.id}> has been **deleted**`)
			.addField('Author', `<@${message.author.id}>`, true)
			.addField('Channel', `<#${message.channel.id}>`, true)
			.addField('Message Content', `\`\`\`\n${message.content === '' || !message.content ? 'None' : message.content}\`\`\``, false)
			.addField('Message Attachments', `${message.attachments.size === 0 ? 'None' : message.attachments.first().attachment}`, false)
			.setTimestamp();

		client.guilds.cache.get(process.env.GUILD).channels.cache.get(process.env.LOG_CHANNEL).send({ embeds: [logEmbed ] }).catch(e => { client.logger.error('[EMBED SEND ERROR]', e); });
		return true;
	}
}

module.exports = {
	Event,
};
