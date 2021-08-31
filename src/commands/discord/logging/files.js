const { oneLine } = require('common-tags');

const Discord = require('discord.js');
const fs = require('fs');

const { MessageActionRow, MessageSelectMenu } = require('discord.js');

class Command {
	constructor(parent, client) {
		this.parent = parent;
		this.client = client;
		this._state = {
			triggers: ['files'],
			description: oneLine`
			Retrieve files from selected channel!`,
			options: {
				permissions: {
					roles: [],
					users: [],
				},
				restrictions: {
					unstable: false,
					hidden: false,
					dangerous: false,
				},
			},
			examples: ['files'],
			author: 'Rubens G Pirie <rubens.pirie@gmail.com> [436876982794452992]',
			maintainers: [{
				name: 'Rubens G Pirie',
				email: 'rubens.pirie@gmail.com',
				discord_id: '436876982794452992',
			}],
		};
	}

	async pre(client, message, args) {
		// const [Commands] = await client.database.models.Commands.findOrCreate({
		// 	where: {
		// 		GuildId: message.guild.id,
		// 		command_name: this._state.triggers[0],
		// 	},
		// });
		return true;
	}

	async register(slashInstance) {
		const data = new slashInstance()
			.setName('files')
			.setDescription('Recieve log files for a channel')
			.addChannelOption(option => option.setName('channel').setDescription('The channel to fetch logs for'));

		return data;
	}

	async post(client, chain, message) {
		return true;
	}

	async finally(client, chain, message) {
		return true;
	}

	async execute(client, chain, message, args) {
		return true;
	}

	async slash(client, interaction) {
		const menu = {
			type: 'SELECT_MENU',
			customId: `logText|${interaction.member.id}`,
			placeholder: 'None Selected',
			minValues: null,
			maxValues: null,
			options: [],
			disabled: false,
		};

		const formatFiles = [];

		if (interaction.options._hoistedOptions[0]) {
			if (!interaction.options._hoistedOptions[0].channel.parentId) return interaction.reply({ content: 'You cannot fetch logs for a channel without a parent!', ephemeral: true });
			if (interaction.options._hoistedOptions[0].channel.type === 'GUILD_CATEGORY') {
				return interaction.reply({ content: 'You cannot fetch logs for a category!', ephemeral: true });
			}
			else if (interaction.options._hoistedOptions[0].channel.type === 'GUILD_TEXT') {
				const files = fs.readdirSync(`./logs/${interaction.options._hoistedOptions[0].channel.parentId}-CATEGORY/${interaction.options._hoistedOptions[0].channel.id}-TEXT`).filter((f) => f.split('.').pop() === 'log');
				menu.customId = `logCustomTXT|${interaction.options._hoistedOptions[0].channel.parentId}|${interaction.options._hoistedOptions[0].channel.id}|${interaction.member.id}`;
				files.forEach(async file => {
					menu.options.push({
						label: file.split('.')[0],
						value: file,
						description: `Log file for date ${file.split('.')[0]}`,
						emoji: null,
						default: false,
					});
					formatFiles.push(`▫️ ${file}`);
				});
			}
			else if (interaction.options._hoistedOptions[0].channel.type === 'GUILD_VOICE') {
				const files = fs.readdirSync(`./logs/${interaction.options._hoistedOptions[0].channel.parentId}-CATEGORY/${interaction.options._hoistedOptions[0].channel.id}-VC`).filter((f) => f.split('.').pop() === 'log');
				menu.customId = `logCustomVC|${interaction.options._hoistedOptions[0].channel.parentId}|${interaction.options._hoistedOptions[0].channel.id}|${interaction.member.id}`;
				files.forEach(async file => {
					menu.options.push({
						label: file.split('.')[0],
						value: file,
						description: `Log file for date ${file.split('.')[0]}`,
						emoji: null,
						default: false,
					});
					formatFiles.push(`▫️ ${file}`);
				});
			}
		}
		else {
			const files = fs.readdirSync(`./logs/${interaction.channel.parentId}-CATEGORY/${interaction.channel.id}-TEXT`).filter((f) => f.split('.').pop() === 'log');

			files.forEach(async file => {
				menu.options.push({
					label: file.split('.')[0],
					value: file,
					description: `Log file for date ${file.split('.')[0]}`,
					emoji: null,
					default: false,
				});
				formatFiles.push(`▫️ ${file}`);
			});
		}

		const row = new MessageActionRow()
			.addComponents(menu);

		const embed = new Discord.MessageEmbed()
			.setAuthor(interaction.guild.name, interaction.guild.iconURL({ dynamic: true }))
			// .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL({ dynamic: true }))
			.setThumbnail(interaction.guild.iconURL({ dynamic: true }))
			.setColor('LUMINOUS_VIVID_PINK')
			.setTitle('Available  Logs')
			.setDescription('Please find below a list of all the availible log files for this channel!')
			.addField('Files', formatFiles.join('\n'))
			.setTimestamp();

		interaction.reply({ embeds: [ embed ], components: [ row ] });
	}

}

module.exports = {
	Command,
};
