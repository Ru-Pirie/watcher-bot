const { KeyvBuilder, Driver } = require('cloudlink-hv/lib/keyv');

const Discord = require('discord.js');
const dateFormat = require('dateformat');
const ms = require('ms');

class Event {
	constructor(parent, client) {
		this.parent = parent;
		this.client = client;
		this._state = {
			options: {
				event: 'guildMemberAdd',
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
	async process(client, chain, member) {
		const age = Date.now() - member.user.createdTimestamp;

		const logEmbed = new Discord.MessageEmbed()
			.setColor('GOLD')
			.setAuthor(member.guild.name, member.guild.iconURL({ dynamic: true }))
			.setTitle('Member Update: `JOINED`')
			.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
			.setDescription(`**${member.user.username}** has joined the server! See detials below for more info.`)
			.addField('Member', `<@${member.id}>`, true)
			.addField('Member ID', member.id, true)
			.addField('\u200B', '\u200B', true)
			.addField('Account Created At', `${dateFormat(member.user.createdTimestamp, 'yyyy-mm-dd HH:MM:ss')}`, true)
			.addField('Account Age', ms(age), true)
			.setTimestamp();

		client.guilds.cache.get(process.env.GUILD).channels.cache.get(process.env.LOG_CHANNEL).send({ embeds: [logEmbed ] }).catch(e => { client.logger.error('[EMBED SEND ERROR]', e); });

		return true;
	}
}

module.exports = {
	Event,
};
