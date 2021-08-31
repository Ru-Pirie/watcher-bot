const { KeyvBuilder, Driver } = require('cloudlink-hv/lib/keyv');

const fs = require('fs');
const dateFormat = require('dateformat');

class Event {
	constructor(parent, client) {
		this.parent = parent;
		this.client = client;
		this._state = {
			options: {
				event: 'messageCreate',
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
	async process(client, chain, message) {
		const now = Date.now();
		if (!fs.existsSync(`./logs/${message.channel.parentId}-CATEGORY/${message.channel.id}-TEXT/${dateFormat(now, 'dd-mm-yyyy')}.log`)) {
			if (!fs.existsSync(`./logs/${message.channel.parentId}-CATEGORY`)) {
				fs.mkdirSync(`./logs/${message.channel.parentId}-CATEGORY`);
				this.client.logger.alert(`Category directory: ${message.channel.parentId}-CATEGORY does not exist creating...`);
			}
			if (!fs.existsSync(`./logs/${message.channel.parentId}-CATEGORY/${message.channel.id}-TEXT`)) {
				fs.mkdirSync(`./logs/${message.channel.parentId}-CATEGORY/${message.channel.id}-TEXT`);
				this.client.logger.alert(`Category directory: ${message.channel.id}-TEXT does not exist creating...`);
			}
			fs.writeFileSync(`./logs/${message.channel.parentId}-CATEGORY/${message.channel.id}-TEXT/${dateFormat(now, 'dd-mm-yyyy')}.log`, '');
			this.client.logger.alert(`Log file for TEXT: ${message.channel.id}-TEXT day ${dateFormat(now, 'dd-mm-yyyy')} does not exist creating...`);
		}

		if (message.attachments.size !== 0) {
			if (message.content === '') {
				await fs.appendFileSync(`./logs/${message.channel.parentId}-CATEGORY/${message.channel.id}-TEXT/${dateFormat(now, 'dd-mm-yyyy')}.log`, `${this.client.logger.unformattedTime(`[${message.author.tag}] (${message.author.id}) ${message.attachments.first().attachment}`)}\n`);
			}
			else {
				await fs.appendFileSync(`./logs/${message.channel.parentId}-CATEGORY/${message.channel.id}-TEXT/${dateFormat(now, 'dd-mm-yyyy')}.log`, `${this.client.logger.unformattedTime(`[${message.author.tag}] (${message.author.id}) Content: ${message.content}  (${message.attachments.first().attachment})`)}\n`);
			}
		}
		else if (message.embeds.length !== 0) {
			if (message.content === '') {
				await fs.appendFileSync(`./logs/${message.channel.parentId}-CATEGORY/${message.channel.id}-TEXT/${dateFormat(now, 'dd-mm-yyyy')}.log`, this.client.logger.unformattedTime(`[${message.author.tag}] (${message.author.id}) EMBED SENT\n`));
			}
			else {
				await fs.appendFileSync(`./logs/${message.channel.parentId}-CATEGORY/${message.channel.id}-TEXT/${dateFormat(now, 'dd-mm-yyyy')}.log`, `${this.client.logger.unformattedTime(`[${message.author.tag}] (${message.author.id}) Content: ${message.content}  (CONTAINED EMBED)`)}\n`);
			}
		}
		else {
			await fs.appendFileSync(`./logs/${message.channel.parentId}-CATEGORY/${message.channel.id}-TEXT/${dateFormat(now, 'dd-mm-yyyy')}.log`, `${this.client.logger.unformattedTime(`[${message.author.tag}] (${message.author.id}) Content: ${message.content}`)}\n`);
		}

		return true;
	}
}

module.exports = {
	Event,
};
