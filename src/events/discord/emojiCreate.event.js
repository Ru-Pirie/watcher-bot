const { KeyvBuilder, Driver } = require('cloudlink-hv/lib/keyv');

const Discord = require('discord.js');

class Event {
	constructor(parent, client) {
		this.parent = parent;
		this.client = client;
		this._state = {
			options: {
				event: 'emojiCreate',
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
	async process(client, chain, emoji) {
		const logEmbed = new Discord.MessageEmbed()
			.setColor('AQUA')
			.setAuthor(emoji.guild.name, emoji.guild.iconURL({ dynamic: true }))
			.setTitle('Emoji Update: `CREATED`')
			.setThumbnail(`https://cdn.discordapp.com/emojis/${emoji.id}.png`)
			.setDescription(`<:${emoji.name}:${emoji.id}> (${emoji.name}) was created.`)
			.addField('Emoji ID', emoji.id, true)
			.addField('Emoji Name', emoji.name, true)
			.addField('Animated', emoji.animated ? 'True' : 'False', true)
			.setTimestamp();

		client.guilds.cache.get(process.env.GUILD).channels.cache.get(process.env.LOG_CHANNEL).send({ embeds: [logEmbed ] }).catch(e => { client.logger.error('[EMBED SEND ERROR]', e); });

		return true;
	}
}

module.exports = {
	Event,
};
