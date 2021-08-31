const { KeyvBuilder, Driver } = require('cloudlink-hv/lib/keyv');

const fs = require('fs');
const dateFormat = require('dateformat');
const Discord = require('discord.js');

class Event {
	constructor(parent, client) {
		this.parent = parent;
		this.client = client;
		this._state = {
			options: {
				event: 'messageUpdate',
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
	async process(client, chain, oldMessage, newMessage) {
		// // Filter out this bot as could cause issues
		// if (oldMessage.author.id === client.user.id) return;

		// Disregards intent updates on messages such as embeds forming
		if (oldMessage.content === newMessage.content || oldMessage.pinned !== newMessage.pinned) return;

		const now = Date.now();
		if (!fs.existsSync(`./logs/${oldMessage.channel.parentId}-CATEGORY/${oldMessage.channel.id}-TEXT/${dateFormat(now, 'dd-mm-yyyy')}.log`)) {
			if (!fs.existsSync(`./logs/${oldMessage.channel.parentId}-CATEGORY`)) {
				fs.mkdirSync(`./logs/${oldMessage.channel.parentId}-CATEGORY`);
				this.client.logger.alert(`Category directory: ${oldMessage.channel.parentId}-CATEGORY does not exist creating...`);
			}
			if (!fs.existsSync(`./logs/${oldMessage.channel.parentId}-CATEGORY/${oldMessage.channel.id}-TEXT`)) {
				fs.mkdirSync(`./logs/${oldMessage.channel.parentId}-CATEGORY/${oldMessage.channel.id}-TEXT`);
				this.client.logger.alert(`Category directory: ${oldMessage.channel.id}-TEXT does not exist creating...`);
			}
			fs.writeFileSync(`./logs/${oldMessage.channel.parentId}-CATEGORY/${oldMessage.channel.id}-TEXT/${dateFormat(now, 'dd-mm-yyyy')}.log`, '');
			this.client.logger.alert(`Log file for TEXT: ${oldMessage.channel.id}-TEXT day ${dateFormat(now, 'dd-mm-yyyy')} does not exist creating...`);
		}

		if (newMessage.attachments.size !== 0) {
			if (newMessage.content === '') {
				await fs.appendFileSync(`./logs/${newMessage.channel.parentId}-CATEGORY/${newMessage.channel.id}-TEXT/${dateFormat(now, 'dd-mm-yyyy')}.log`, `${this.client.logger.unformattedTime(`[${newMessage.author.tag}] (${newMessage.author.id}) ${oldMessage.content} ➜ ${newMessage.attachments.first().attachment}`)}\n`);
			}
			else {
				await fs.appendFileSync(`./logs/${newMessage.channel.parentId}-CATEGORY/${newMessage.channel.id}-TEXT/${dateFormat(now, 'dd-mm-yyyy')}.log`, `${this.client.logger.unformattedTime(`[${newMessage.author.tag}] (${newMessage.author.id}) ${oldMessage.content} ➜ Content: ${newMessage.content}  (${newMessage.attachments.first().attachment})`)}\n`);
			}
		}
		else if (newMessage.embeds.length !== 0) {
			if (newMessage.content === '') {
				await fs.appendFileSync(`./logs/${newMessage.channel.parentId}-CATEGORY/${newMessage.channel.id}-TEXT/${dateFormat(now, 'dd-mm-yyyy')}.log`, this.client.logger.unformattedTime(`[${newMessage.author.tag}] (${newMessage.author.id}) ${oldMessage.content} ➜ EMBED SENT\n`));
			}
			else {
				await fs.appendFileSync(`./logs/${newMessage.channel.parentId}-CATEGORY/${newMessage.channel.id}-TEXT/${dateFormat(now, 'dd-mm-yyyy')}.log`, `${this.client.logger.unformattedTime(`[${newMessage.author.tag}] (${newMessage.author.id}) ${oldMessage.content} ➜ Content: ${newMessage.content}  (CONTAINED EMBED)`)}\n`);
			}
		}
		else {
			await fs.appendFileSync(`./logs/${newMessage.channel.parentId}-CATEGORY/${newMessage.channel.id}-TEXT/${dateFormat(now, 'dd-mm-yyyy')}.log`, `${this.client.logger.unformattedTime(`[${newMessage.author.tag}] (${newMessage.author.id}) ${oldMessage.content} ➜ Content: ${newMessage.content}`)}\n`);
		}

		const logEmbed = new Discord.MessageEmbed()
			.setColor('ORANGE')
			.setAuthor(oldMessage.guild.name, oldMessage.guild.iconURL({ dynamic: true }))
			.setThumbnail(newMessage.author.displayAvatarURL({ dynamic: true }))
			.setTitle('Message Update: `UPDATED`')
			.setDescription(`**${newMessage.author.username}** has updated there message in <#${newMessage.channel.id}>.`)
			.addField('Old Message', `\`\`\`\n${oldMessage.content === '' || !oldMessage.content ? 'None' : oldMessage.content}\`\`\``, false)
			.addField('New Message', `\`\`\`\n${newMessage.content === '' || !newMessage.content ? 'None' : newMessage.content}\`\`\``, false)
			.addField('Attachments', `${newMessage.attachments.first() ? newMessage.attachments.first().url : 'None'}`, true)
			.addField('Channel', ` [Jump to Message](${newMessage.url})`, true)
			.setTimestamp();

		client.guilds.cache.get(process.env.GUILD).channels.cache.get(process.env.LOG_CHANNEL).send({ embeds: [ logEmbed ] }).catch(e => { client.logger.error('[EMBED SEND ERROR]', e); });

		return true;
	}
}

module.exports = {
	Event,
};
