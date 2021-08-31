const { KeyvBuilder, Driver } = require('cloudlink-hv/lib/keyv');

const Discord = require('discord.js');
const ms = require('ms');

class Event {
	constructor(parent, client) {
		this.parent = parent;
		this.client = client;
		this._state = {
			options: {
				event: 'channelUpdate',
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
	async process(client, chain, oldChannel, newChannel) {
		const oldParent = oldChannel.guild.channels.cache.get(oldChannel.parentId);
		const newParent = newChannel.guild.channels.cache.get(newChannel.parentId);

		const oldChange = [];
		const change = [];
		const newChange = [];

		if (oldChannel.parentId !== newChannel.parentId) {
			oldChange.push(`${oldParent.name}`);
			change.push('CATEGORY');
			newChange.push(`${newParent.name}`);
		}
		if (oldChannel.name !== newChannel.name) {
			oldChange.push(`${oldChannel.name}`);
			change.push('NAME');
			newChange.push(`${newChannel.name}`);
		}
		if (oldChannel.nsfw !== newChannel.nsfw) {
			oldChange.push(oldChannel.nsfw ? 'Enabled' : 'Disabled');
			change.push('NSWF');
			newChange.push(newChannel.nsfw ? 'Enabled' : 'Disabled');
		}
		if (oldChannel.topic !== newChannel.topic) {
			oldChange.push(!oldChannel.topic ? 'None' : oldChannel.topic);
			change.push('TOPIC');
			newChange.push(!newChannel.topic ? 'None' : newChannel.topic);
		}
		if (oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser) {
			oldChange.push(ms(oldChannel.rateLimitPerUser * 1000));
			change.push('SLOWMODE');
			newChange.push(ms(newChannel.rateLimitPerUser * 1000));
		}
		if (oldChannel.bitrate !== newChannel.bitrate) {
			oldChange.push((oldChannel.bitrate / 1000) + 'kbps');
			change.push('BITRATE');
			newChange.push((newChannel.bitrate / 1000) + 'kbps');
		}
		if (oldChannel.rtcRegion !== newChannel.rtcRegion) {
			oldChange.push(!oldChannel.rtcRegion ? 'None' : oldChannel.rtcRegion);
			change.push('REGION');
			newChange.push(!newChannel.rtcRegion ? 'None' : newChannel.rtcRegion);
		}
		if (oldChannel.userLimit !== newChannel.userLimit) {
			oldChange.push(oldChannel.userLimit);
			change.push('USER LIMIT');
			newChange.push(newChannel.userLimit);
		}

		if (change.length === 0) {
			oldChange.push('~~~~~');
			change.push('PERMISSIONS');
			newChange.push('~~~~~');
			return;
		};

		const logEmbed = new Discord.MessageEmbed()
			.setColor('PURPLE')
			.setAuthor(newChannel.guild.name, newChannel.guild.iconURL({ dynamic: true }))
			.setTitle('Channel Update: `UPDATED`')
			.setDescription(`<#${newChannel.id}> has had some changes made.`)
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
