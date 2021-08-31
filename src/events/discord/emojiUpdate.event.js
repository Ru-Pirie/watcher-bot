const { KeyvBuilder, Driver } = require('cloudlink-hv/lib/keyv');

const Discord = require('discord.js');

class Event {
	constructor(parent, client) {
		this.parent = parent;
		this.client = client;
		this._state = {
			options: {
				event: 'emojiUpdate',
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
	async process(client, chain, oldEmoji, newEmoji) {
		const oldChange = [];
		const change = [];
		const newChange = [];

		if (oldEmoji.name !== newEmoji.name) {
			oldChange.push(oldEmoji.name);
			change.push('NAME');
			newChange.push(newEmoji.name);
		}

		const logEmbed = new Discord.MessageEmbed()
			.setColor('AQUA')
			.setAuthor(oldEmoji.guild.name, oldEmoji.guild.iconURL({ dynamic: true }))
			.setTitle('Emoji Update: `UPDATED`')
			.setThumbnail(`https://cdn.discordapp.com/emojis/${oldEmoji.id}.png`)
			.setDescription(`<:${oldEmoji.name}:${oldEmoji.id}> (${oldEmoji.name}) has had its name changed.`)
			.addField('Old', `\`\`\`diff\n- ${oldChange.join('\n\n- ')}\`\`\``, true)
			.addField('Change', `\`\`\`asciidoc\n= ${change.join(' =\n\n= ')} =\`\`\``, true)
			.addField('New:', `\`\`\`diff\n+ ${newChange.join('\n\n+ ')}\`\`\``, true)
			.setTimestamp();

		client.guilds.cache.get(process.env.GUILD).channels.cache.get(process.env.LOG_CHANNEL).send({ embeds: [logEmbed ] }).catch(e => { client.logger.error('[EMBED SEND ERROR]', e); });

		return true;
	}
}

module.exports = {
	Event,
};
