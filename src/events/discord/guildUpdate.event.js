const { KeyvBuilder, Driver } = require('cloudlink-hv/lib/keyv');

const Discord = require('discord.js');
const ms = require('ms');

class Event {
	constructor(parent, client) {
		this.parent = parent;
		this.client = client;
		this._state = {
			options: {
				event: 'guildUpdate',
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
	async process(client, chain, oldGuild, newGuild) {
		if (oldGuild.name !== newGuild.name) {
			const logEmbed = new Discord.MessageEmbed()
				.setColor('DARK_BLUE')
				.setAuthor(oldGuild.name, oldGuild.iconURL({ dynamic: true }))
				.setThumbnail(oldGuild.iconURL({ dynamic: true }))
				.setTitle('Guild Update: `NAME`')
				.setDescription(`${oldGuild.name} has had its **name** changed!`)
				.addField('Old Name:', `${oldGuild.name}`)
				.addField('New Name:', `${newGuild.name}`)
				.setTimestamp();

			client.guilds.cache.get(process.env.GUILD).channels.cache.get(process.env.LOG_CHANNEL).send({ embeds: [logEmbed ] }).catch(e => { client.logger.error('[EMBED SEND ERROR]', e); });
		}

		if (oldGuild.description !== newGuild.description) {
			const logEmbed = new Discord.MessageEmbed()
				.setColor('DARK_BLUE')
				.setAuthor(oldGuild.name, oldGuild.iconURL({ dynamic: true }))
				.setThumbnail(oldGuild.iconURL({ dynamic: true }))
				.setTitle('Guild Update: `DESCRIPTION`')
				.setDescription(`${oldGuild.name} has had its **description** changed!`)
				.addField('Old Description:', `${oldGuild.description}`)
				.addField('New Description:', `${newGuild.description}`)
				.setTimestamp();

			client.guilds.cache.get(process.env.GUILD).channels.cache.get(process.env.LOG_CHANNEL).send({ embeds: [logEmbed ] }).catch(e => { client.logger.error('[EMBED SEND ERROR]', e); });
		}

		if (oldGuild.iconURL() !== newGuild.iconURL()) {
			const logEmbed = new Discord.MessageEmbed()
				.setColor('DARK_BLUE')
				.setAuthor(oldGuild.name, oldGuild.iconURL({ dynamic: true }))
				.setThumbnail(oldGuild.iconURL({ dynamic: true }))
				.setTitle('Guild Update: `ICON`')
				.setDescription(`${oldGuild.name} has had its **icon** changed!`)
				.addField('Old Icon URL:', `${oldGuild.iconURL()}`)
				.addField('New Icon URL:', `${newGuild.iconURL()}`)
				.setTimestamp();

			client.guilds.cache.get(process.env.GUILD).channels.cache.get(process.env.LOG_CHANNEL).send({ embeds: [logEmbed ] }).catch(e => { client.logger.error('[EMBED SEND ERROR]', e); });
		}

		if (oldGuild.nsfwLevel !== newGuild.nsfwLevel) {
			const logEmbed = new Discord.MessageEmbed()
				.setColor('DARK_BLUE')
				.setAuthor(oldGuild.name, oldGuild.iconURL({ dynamic: true }))
				.setThumbnail(oldGuild.iconURL({ dynamic: true }))
				.setTitle('Guild Update: `NSFW LEVEL`')
				.setDescription(`${oldGuild.name} has had its **NSFW Level** changed!`)
				.addField('Old Level:', `${oldGuild.nsfwLevel}`)
				.addField('New Level:', `${newGuild.nsfwLevel}`)
				.setTimestamp();

			client.guilds.cache.get(process.env.GUILD).channels.cache.get(process.env.LOG_CHANNEL).send({ embeds: [logEmbed ] }).catch(e => { client.logger.error('[EMBED SEND ERROR]', e); });
		}

		if (oldGuild.ownerId !== newGuild.ownerId) {
			const logEmbed = new Discord.MessageEmbed()
				.setColor('DARK_BLUE')
				.setAuthor(oldGuild.name, oldGuild.iconURL({ dynamic: true }))
				.setThumbnail(oldGuild.iconURL({ dynamic: true }))
				.setTitle('Guild Update: `Owner`')
				.setDescription(`${oldGuild.name} has had its **owner** changed!`)
				.addField('Old Owner:', `${oldGuild.ownerId}`)
				.addField('New Owner:', `${newGuild.ownerId}`)
				.setTimestamp();

			client.guilds.cache.get(process.env.GUILD).channels.cache.get(process.env.LOG_CHANNEL).send({ embeds: [logEmbed ] }).catch(e => { client.logger.error('[EMBED SEND ERROR]', e); });
		}

		return true;
	}
}

module.exports = {
	Event,
};
