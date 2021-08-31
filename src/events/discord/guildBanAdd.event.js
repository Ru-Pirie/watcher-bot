const { KeyvBuilder, Driver } = require('cloudlink-hv/lib/keyv');

const Discord = require('discord.js');

class Event {
	constructor(parent, client) {
		this.parent = parent;
		this.client = client;
		this._state = {
			options: {
				event: 'guildBanAdd',
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
	async process(client, chain, ban) {
		const logEmbed = new Discord.MessageEmbed()
			.setColor('DARK_RED')
			.setAuthor(ban.guild.name, ban.guild.iconURL({ dynamic: true }))
			.setTitle('Member Update: `BANNED`')
			.setThumbnail(ban.user.displayAvatarURL({ dynamic: true }))
			.setDescription(`<@${ban.user.id}> has been banned!`)
			.addField('Username', ban.user.username + '#' + ban.user.discriminator, true)
			.addField('ID', ban.user.id, true)
			.addField('Bot', ban.user.bot ? 'True' : 'False', true)
			.setTimestamp();

		client.guilds.cache.get(process.env.GUILD).channels.cache.get(process.env.LOG_CHANNEL).send({ embeds: [logEmbed ] }).catch(e => { client.logger.error('[EMBED SEND ERROR]', e); });

		return true;
	}
}

module.exports = {
	Event,
};
