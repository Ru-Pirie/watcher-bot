const { KeyvBuilder, Driver } = require('cloudlink-hv/lib/keyv');

const Discord = require('discord.js');
const ms = require('ms');

class Event {
	constructor(parent, client) {
		this.parent = parent;
		this.client = client;
		this._state = {
			options: {
				event: 'guildMemberUpdate',
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
	async process(client, chain, oldMember, newMember) {

		if (oldMember.roles.cache.size < newMember.roles.cache.size) {
			const role = newMember.roles.cache
				.difference(oldMember.roles.cache)
				.first();
			const logEmbed = new Discord.MessageEmbed()
				.setColor('GOLD')
				.setAuthor(oldMember.guild.name, oldMember.guild.iconURL({ dynamic: true }))
				.setThumbnail(oldMember.user.displayAvatarURL({ dynamic: true }))
				.setTitle('Member Update: `ROLE ADDED`')
				.setDescription(`<@${oldMember.id}> has had a **role** added!`)
				.addField('Role', `<@&${role.id}>`, true)
				.setTimestamp();

			return client.guilds.cache.get(process.env.GUILD).channels.cache.get(process.env.LOG_CHANNEL).send({ embeds: [logEmbed ] }).catch(e => { client.logger.error('[EMBED SEND ERROR]', e); });
		}
		if (oldMember.roles.cache.size > newMember.roles.cache.size) {
			const role = oldMember.roles.cache
				.difference(newMember.roles.cache)
				.first();

			const logEmbed = new Discord.MessageEmbed()
				.setColor('GOLD')
				.setAuthor(oldMember.guild.name, oldMember.guild.iconURL({ dynamic: true }))
				.setThumbnail(oldMember.user.displayAvatarURL({ dynamic: true }))
				.setTitle('Member Update: `ROLE REMOVED`')
				.setDescription(`<#${oldMember.id}> has had a **role** removed!`)
				.addField('Role', `<@&${role.id}>`, true)
				.setTimestamp();

			return client.guilds.cache.get(process.env.GUILD).channels.cache.get(process.env.LOG_CHANNEL).send({ embeds: [logEmbed ] }).catch(e => { client.logger.error('[EMBED SEND ERROR]', e); });
		}

		if (newMember.nickname !== oldMember.nickname) {
			const logEmbed = new Discord.MessageEmbed()
				.setColor('GOLD')
				.setAuthor(oldMember.guild.name, oldMember.guild.iconURL({ dynamic: true }))
				.setThumbnail(oldMember.user.displayAvatarURL({ dynamic: true }))
				.setTitle('Member Update: `NICKNAME`')
				.setDescription(`<@${oldMember.id}>'s nickname has changed!`)
				.addField('Old Nick', `${!oldMember.nickname ? 'None' : oldMember.nickname}`, true)
				.addField('New Nick', `${!newMember.nickname ? 'None' : newMember.nickname}`, true)
				.setTimestamp();

			return client.guilds.cache.get(process.env.GUILD).channels.cache.get(process.env.LOG_CHANNEL).send({ embeds: [logEmbed ] }).catch(e => { client.logger.error('[EMBED SEND ERROR]', e); });
		}

		return true;
	}
}

module.exports = {
	Event,
};
