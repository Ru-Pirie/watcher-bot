const { KeyvBuilder, Driver } = require('cloudlink-hv/lib/keyv');

const Discord = require('discord.js');
const fs = require('fs');
const dateFormat = require('dateformat');

class Event {
	constructor(parent, client) {
		this.parent = parent;
		this.client = client;
		this._state = {
			options: {
				event: 'voiceStateUpdate',
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
	async process(client, chain, oldState, newState) {
		const now = Date.now();

		if (oldState.channel) {
			if (!fs.existsSync(`./logs/${oldState.channel.parentId}-CATEGORY/${oldState.channel.id}-VC/${dateFormat(now, 'dd-mm-yyyy')}.log`)) {
				if (!fs.existsSync(`./logs/${oldState.channel.parentId}-CATEGORY`)) {
					fs.mkdirSync(`./logs/${oldState.channel.parentId}-CATEGORY`);
					this.client.logger.alert(`Category directory: ${oldState.channel.parentId}-CATEGORY does not exist creating...`);
				}
				if (!fs.existsSync(`./logs/${oldState.channel.parentId}-CATEGORY/${oldState.channel.id}-VC`)) {
					fs.mkdirSync(`./logs/${oldState.channel.parentId}-CATEGORY/${oldState.channel.id}-VC`);
					this.client.logger.alert(`Category directory: ${oldState.channel.id}-VC does not exist creating...`);
				}
				fs.writeFileSync(`./logs/${oldState.channel.parentId}-CATEGORY/${oldState.channel.id}-VC/${dateFormat(now, 'dd-mm-yyyy')}.log`, '');
				this.client.logger.alert(`Log file for VC: ${oldState.channel.id}-VC day ${dateFormat(now, 'dd-mm-yyyy')} does not exist creating...`);
			}
		}

		if (newState.channel) {
			if (!fs.existsSync(`./logs/${newState.channel.parentId}-CATEGORY/${newState.channel.id}-VC/${dateFormat(now, 'dd-mm-yyyy')}.log`) && newState) {
				if (!fs.existsSync(`./logs/${newState.channel.parentId}-CATEGORY`)) {
					fs.mkdirSync(`./logs/${newState.channel.parentId}-CATEGORY`);
					this.client.logger.alert(`Category directory: ${newState.channel.parentId}-CATEGORY does not exist creating...`);
				}
				if (!fs.existsSync(`./logs/${newState.channel.parentId}-CATEGORY/${newState.channel.id}-VC`)) {
					fs.mkdirSync(`./logs/${newState.channel.parentId}-CATEGORY/${newState.channel.id}-VC`);
					this.client.logger.alert(`Category directory: ${newState.channel.id}-VC does not exist creating...`);
				}
				fs.writeFileSync(`./logs/${newState.channel.parentId}-CATEGORY/${newState.channel.id}-VC/${dateFormat(now, 'dd-mm-yyyy')}.log`, '');
				this.client.logger.alert(`Log file for VC: ${newState.channel.id}-VC day ${dateFormat(now, 'dd-mm-yyyy')} does not exist creating...`);
			}
		}


		// Muted or unmuted or something that did not cause the current channel to change
		if (oldState.channelId === newState.channelId) {
			// await fs.appendFileSync(`./logs/${oldState.channel.parentId}-CATEGORY/${oldState.channel.id}-VC/${dateFormat(now, 'dd-mm-yyyy')}.log`, this.client.logger.unformattedTime(`[${oldState.member.user.tag}] (${oldState.member.user.id}) EMBED SENT\n`));
			// const logEmbed = new Discord.MessageEmbed()
			// 	.setColor('GREEN')
			// 	.setmember.user(oldState.guild.name, oldState.guild.iconURL({ dynamic: true }))
			// 	.setThumbnail(oldState.member.user.displayAvatarURL({ dynamic: true }))
			// 	.setTitle('Voice State Update: `UPDATED`')
			// 	.setDescription(`**${newMessage.member.user.username}** has updated there message in <#${newMessage.channel.id}>.`)
			// 	.addField('Old Message', `\`\`\`\n${oldMessage.content === '' || !oldMessage.content ? 'None' : oldMessage.content}\`\`\``, false)
			// 	.addField('New Message', `\`\`\`\n${newMessage.content === '' || !newMessage.content ? 'None' : newMessage.content}\`\`\``, false)
			// 	.addField('Attachments', `${newMessage.attachments.first() ? newMessage.attachments.first().url : 'None'}`, true)
			// 	.addField('Channel', ` [Jump to Message](${newMessage.url})`, true)
			// 	.setTimestamp();

			// return client.guilds.cache.get(process.env.GUILD).channels.cache.get(process.env.LOG_CHANNEL).send({ embeds: [ logEmbed ] });
		}
		// User has joined a channel
		else if (!oldState.channelId && newState.channelId) {
			await fs.appendFileSync(`./logs/${newState.channel.parentId}-CATEGORY/${newState.channel.id}-VC/${dateFormat(now, 'dd-mm-yyyy')}.log`, this.client.logger.unformattedTime(`[${newState.member.user.tag}] (${oldState.member.user.id}) Joined channel ==> ${newState.channel.name} (${newState.channel.id})\n`));
			const logEmbed = new Discord.MessageEmbed()
				.setColor('LUMINOUS_VIVID_PINK')
				.setAuthor(oldState.guild.name, oldState.guild.iconURL({ dynamic: true }))
				.setThumbnail(oldState.member.user.displayAvatarURL({ dynamic: true }))
				.setTitle('Voice State Update: `JOINED CHANNEL`')
				.setDescription(`<@${oldState.member.id}> has **joined** the voice channel <#${newState.channelId}>`)
				.addField('Old Channel', !oldState.channelId ? 'None' : `<#${oldState.channelId}>`, true)
				.addField('User', `<@${oldState.member.id}>`, true)
				.addField('New Channel', !newState.channelId ? 'None' : `<#${newState.channelId}>`, true)
				.setTimestamp();

			return client.guilds.cache.get(process.env.GUILD).channels.cache.get(process.env.LOG_CHANNEL).send({ embeds: [ logEmbed ] });
		}
		// User has left a channel
		else if (oldState.channelId && !newState.channelId) {
			await fs.appendFileSync(`./logs/${oldState.channel.parentId}-CATEGORY/${oldState.channel.id}-VC/${dateFormat(now, 'dd-mm-yyyy')}.log`, this.client.logger.unformattedTime(`[${oldState.member.user.tag}] (${oldState.member.user.id}) Left Channel ==> ${oldState.channel.name} (${oldState.channel.id})\n`));
			const logEmbed = new Discord.MessageEmbed()
				.setColor('LUMINOUS_VIVID_PINK')
				.setAuthor(oldState.guild.name, oldState.guild.iconURL({ dynamic: true }))
				.setThumbnail(oldState.member.user.displayAvatarURL({ dynamic: true }))
				.setTitle('Voice State Update: `LEFT CHANNEL`')
				.setDescription(`<@${oldState.member.id}> has **left** the voice channel <#${oldState.channelId}>`)
				.addField('Old Channel', !oldState.channelId ? 'None' : `<#${oldState.channelId}>`, true)
				.addField('User', `<@${oldState.member.id}>`, true)
				.addField('New Channel', !newState.channelId ? 'None' : `<#${newState.channelId}>`, true)
				.setTimestamp();

			return client.guilds.cache.get(process.env.GUILD).channels.cache.get(process.env.LOG_CHANNEL).send({ embeds: [ logEmbed ] });
		}
		// User has changed channel
		else if (oldState.channelId !== newState.channelId) {
			await fs.appendFileSync(`./logs/${oldState.channel.parentId}-CATEGORY/${oldState.channel.id}-VC/${dateFormat(now, 'dd-mm-yyyy')}.log`, this.client.logger.unformattedTime(`[${oldState.member.user.tag}] (${oldState.member.user.id}) Switched Channels: ${oldState.channel.name} (${oldState.channel.id}) ==> ${newState.channel.name} (${newState.channel.id})\n`));
            await fs.appendFileSync(`./logs/${newState.channel.parentId}-CATEGORY/${newState.channel.id}-VC/${dateFormat(now, 'dd-mm-yyyy')}.log`, this.client.logger.unformattedTime(`[${newState.member.user.tag}] (${oldState.member.user.id}) Joined channel ==> ${newState.channel.name} (${newState.channel.id})\n`));
            const logEmbed = new Discord.MessageEmbed()
				.setColor('GREEN')
				.setAuthor(oldState.guild.name, oldState.guild.iconURL({ dynamic: true }))
				.setThumbnail(oldState.member.user.displayAvatarURL({ dynamic: true }))
				.setTitle('Voice State Update: `CHANGED CHANNEL`')
				.setDescription(`<@${oldState.member.id}> has **changed** the voice channel <#${newState.channelId}>`)
				.addField('Old Channel', !oldState.channelId ? 'None' : `<#${oldState.channelId}>`, true)
				.addField('User', `<@${oldState.member.id}>`, true)
				.addField('New Channel', !newState.channelId ? 'None' : `<#${newState.channelId}>`, true)
				.setTimestamp();

			return client.guilds.cache.get(process.env.GUILD).channels.cache.get(process.env.LOG_CHANNEL).send({ embeds: [ logEmbed ] });
		}

		return true;
	}
}

module.exports = {
	Event,
};
