const { RichEmbed } = module.require('discord.js');
const Moment = module.require('moment');

/**
 * Represents a command
 */
class Command {
    /**
     * @param {client} client The client used in the command
     * @param {Object} options The command's configuration
     */
    constructor(client, options) {
        Moment.locale('nl');

        /**
         * The client used in the command
         * @type {client}
         */
        this.client = client;

        /**
         * The command's information properties
         * @type {Object}
         */
        this.help = {
            name: options.name || null,
            description: options.description || "No information specified.",
            usage: options.usage || "",
            category: options.category || "Information"
        };

        /**
         * The command's configuration
         * @type {Object}
         */
        this.conf = {
            permLevel: options.permLevel || 0,
            permission: options.permission || "SEND_MESSAGES",
            cooldown: options.cooldown || 1000,
            aliases: options.aliases || [],
            allowDMs: options.allowDMs || false
        };

        /**
         * A set of the IDs of the users on cooldown
         * @type {Set}
         */
        this.cooldown = new Set();
    }

    validateInput(cmd, args, data) {

        // Help requested, no other validation required.
        if (args.length > 0 && args[0] === 'help') { return true; }

        if (args.length < 3) { this.message.channel.send('Missing parameters.'); return false; }

        const [ activity, date, time ] = args;

        if (!data.mode.hasOwnProperty(activity)) { this.message.channel.send(`Invalid ${activity} activity specified.`); return false; }
        if (!Moment(date, 'DD-MM-YYYY').isValid()) { this.message.channel.send('Invalid Date specified. (Must be of DD-MM-YYYY)'); return false; }
        if (!Moment(time, 'HH:mm').isValid()) { this.message.channel.send('Invalid Time specified. (Must be of HH:mm)'); return false; }

        return true;
    }

    sendHelp() {
        this.respondDm(`**${this.help.description}**`);
        this.respondDm(`\`\`\`${this.help.usage}\`\`\``);
    }

    createActivityEmbed(activity, args, data) {
        let mode = data.mode[args.shift()];
        let date = args.shift();
        let time = args.shift();
        let datetime = Moment(date + ' ' + time, 'DD-MM-YYYY HH:mm');
        let when = datetime.format('LLL');
        let note = args.join(' ');
        if (note === '') note = '-';
        let startsIn = datetime.toNow(true);

        return new RichEmbed()
            .setColor(data.color) // depends on activity type? (green pve, red pvp)
            .setThumbnail(data.thumbnail)
            .setAuthor(this.message.author.username, this.message.author.avatarURL)
            .setTitle(`${activity} activiteit`)
            .addField(mode.name, `Begint in \`${startsIn}\``, false)
            .addField('Notitie', note, false)
            .addField('Datum', `${when}`, true)
            .addField('Aantal spelers', mode.maxplayers, true)
            .addBlankField()
            .addField(`✅ Deelnemers (0/${mode.maxplayers})`, '```Geen```')
            .addField(`🕒 Wachtlijst (0)`, '```Geen```')
            .setFooter('Event starts')
            .setTimestamp(datetime);
    }

    /**
     * Puts a user on cooldown
     * @param {String} user The ID of the user to put on cooldown
     */
    startCooldown(user) {
        // Adds the user to the set
        this.cooldown.add(user);

        // Removes the user from the set after the cooldown is done
        setTimeout(() => {
            this.cooldown.delete(user);
        }, this.conf.cooldown);
    }

    setMessage(message) {
        this.message = message;
    }

    respond(message) {
        return this.message.channel.send(message);
    }

    respondDm(message) {
        return this.message.author.send(message);
    }
}

module.exports = Command;