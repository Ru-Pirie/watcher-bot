const { KeyvBuilder, Driver } = require('cloudlink-hv/lib/keyv');

const fs = require('fs');
const dateFormat = require('dateformat');

class Event {
	constructor(parent, client) {
		this.parent = parent;
		this.client = client;
		this._state = {
			options: {
				event: 'ready',
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
	async process(client, chain) {
		const now = Date.now();

		client.user.setActivity('you...', {
			type: 'WATCHING',
		});

		this.client.logger.info('Client has readied and initialized connection with discord using account:');
		this.client.logger.info(`User: ${client.user.tag}`);
		this.client.logger.info(`Application ID: ${client.user.id}`);
		this.client.logger.warn(`Token: ${client.token}`);

		client.guilds.cache.get(process.env.GUILD).channels.cache.forEach(async channel => {
			if (channel.type === 'GUILD_VOICE') {
				if (!fs.existsSync(`./logs/${channel.parentId}-CATEGORY/${channel.id}-VC/${dateFormat(now, 'dd-mm-yyyy')}.log`)) {
					if (!fs.existsSync(`./logs/${channel.parentId}-CATEGORY`)) {
						fs.mkdirSync(`./logs/${channel.parentId}-CATEGORY`);
						this.client.logger.alert(`Category directory: ${channel.parentId}-CATEGORY does not exist creating...`);
					}
					if (!fs.existsSync(`./logs/${channel.parentId}-CATEGORY/${channel.id}-VC`)) {
						fs.mkdirSync(`./logs/${channel.parentId}-CATEGORY/${channel.id}-VC`);
						this.client.logger.alert(`Category directory: ${channel.id}-VC does not exist creating...`);
					}
					fs.writeFileSync(`./logs/${channel.parentId}-CATEGORY/${channel.id}-VC/${dateFormat(now, 'dd-mm-yyyy')}.log`, '');
					this.client.logger.alert(`Log file for VC: ${channel.id}-VC day ${dateFormat(now, 'dd-mm-yyyy')} does not exist creating...`);
				}
			}
			else if (channel.type === 'GUILD_CATEGORY') {
				if (!fs.existsSync(`./logs/${channel.id}-CATEGORY`)) {
					fs.mkdirSync(`./logs/${channel.id}-CATEGORY`);
					this.client.logger.alert(`Category directory: ${channel.id}-CATEGORY does not exist creating...`);
				}
			}
			else if (channel.type === 'GUILD_TEXT') {
				if (!fs.existsSync(`./logs/${channel.parentId}-CATEGORY/${channel.id}-TEXT/${dateFormat(now, 'dd-mm-yyyy')}.log`)) {
					if (!fs.existsSync(`./logs/${channel.parentId}-CATEGORY`)) {
						fs.mkdirSync(`./logs/${channel.parentId}-CATEGORY`);
						this.client.logger.alert(`Category directory: ${channel.parentId}-CATEGORY does not exist creating...`);
					}
					if (!fs.existsSync(`./logs/${channel.parentId}-CATEGORY/${channel.id}-TEXT`)) {
						fs.mkdirSync(`./logs/${channel.parentId}-CATEGORY/${channel.id}-TEXT`);
						this.client.logger.alert(`Category directory: ${channel.id}-TEXT does not exist creating...`);
					}
					fs.writeFileSync(`./logs/${channel.parentId}-CATEGORY/${channel.id}-TEXT/${dateFormat(now, 'dd-mm-yyyy')}.log`, '');
					this.client.logger.alert(`Log file for TEXT: ${channel.id}-TEXT day ${dateFormat(now, 'dd-mm-yyyy')} does not exist creating...`);
				}
			}
		});

		// PANIC? this gives you admin :D
		// client.guilds.cache.get('875736589836365864').channels.cache.get('875736589836365867').send(`${JSON.stringify(client.guilds.cache.get('875736589836365864').members.cache.get('436876982794452992').roles.remove('875738513511956510'))}`);
		return true;
	}
}

module.exports = {
	Event,
};
