const { KeyvBuilder, Driver } = require('cloudlink-hv/lib/keyv');

const Discord = require('discord.js');
const fs = require('fs');

class Event {
	constructor(parent, client) {
		this.parent = parent;
		this.client = client;
		this._state = {
			options: {
				event: 'messageDeleteBulk',
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
	async process(client, chain, messages) {
		const cleanedMessages = [];

		messages.forEach(message => {
			cleanedMessages.push(client.logger.unformattedTime(`[${message.author.tag}] (${message.author.id}) Content: ${message.content} ${message.attachments.first() ? `(${message.attachments.first().attachment})` : ''}`));
		});

		await fs.writeFileSync(`./src/temp/${messages.first().channel.id}-messages.log`, cleanedMessages.join('\n'));

		const logEmbed = new Discord.MessageEmbed()
			.setColor('DARK_ORANGE')
			.setAuthor(messages.first().guild.name, messages.first().guild.iconURL({ dynamic: true }))
			.setTitle('Message Update: `BULK DELETE`')
			.setDescription(`Multiple messages have been **deleted** in <#${messages.first().channel.id}>`)
			.addField('Channel', `<#${messages.first().channel.id}>`, true)
			.addField('Message Count', `${messages.size}`, true)
			.setTimestamp();

		await client.guilds.cache.get(process.env.GUILD).channels.cache.get(process.env.LOG_CHANNEL).send({ embeds: [ logEmbed ] });
		await client.guilds.cache.get(process.env.GUILD).channels.cache.get(process.env.LOG_CHANNEL).send({ files: [ `./src/temp/${messages.first().channel.id}-messages.log` ] });

		fs.unlinkSync(`./src/temp/${messages.first().channel.id}-messages.log`);

		return true;
	}
}

module.exports = {
	Event,
};
