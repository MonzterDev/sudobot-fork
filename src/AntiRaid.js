const { lockAll } = require('../commands/lockall');

module.exports = class AntiRaid {
    constructor() {
        this.joins = 0;
    }

    load(guild) {
        this.maxJoins = app.config.props[guild.id].raid.max_joins;
        this.excluded = app.config.props[guild.id].raid.excluded;
        this.time = app.config.props[guild.id].raid.time;
        this.enabled = app.config.props[guild.id].raid.enabled;
    }

    async start(member) {
        if (member.user.bot) {
            console.log('bot');
            return;
        }

        await this.load(member.guild);

        if (!this.enabled)
            return;

        console.log('Joined');

        setTimeout(() => {
            this.joins = 0;
            console.log('RAID reset');
        }, this.time);

        this.joins++;

        if (this.joins >= this.maxJoins) {
            let role = member.guild.roles.cache.find(r => r.id === app.config.props[member.guild.id].gen_role);
            let channels = member.guild.channels.cache.filter(channel => this.excluded.indexOf(channel.id) === -1 && this.excluded.indexOf(channel.parent?.id) === -1 && channel.type === 'GUILD_TEXT');

            await lockAll(role, channels, true);
        }
    }
};