class MessageReactionRemove {
    constructor(client) {
        this.client = client;
    }

    run(reaction, user) {
        // Ignore reacts the bot sets
        if (user.bot === true) return;

        console.log(`${user.username} removed their "${reaction.emoji.name}" reaction.`);

        /**
         fields[0] = name
         fields[1] = note
         fields[2] = date
         fields[3] = maxplayers
         fields[4] = -BLANK-
         fields[5] = participants
         fields[6] = reserves
         */
        let embed = reaction.message.embeds[0];
        let embedReactions = reaction.message.reactions;

        let participants = embedReactions.get('✅').users.map(user => {
            return user.username;
        });
        let reserves = embedReactions.get('🕒').users.map(user => {
            return user.username;
        });

        // Update Participants
        embed.fields[5].name = embed.fields[5].name.replace(/\(\d\/(\d+)\)/i,`(${participants.length}/$1)`);
        embed.fields[5].value = `\`\`\`${this.convArrayToNewLines(participants)}\`\`\``;

        // Update Reserves
        embed.fields[6].name = embed.fields[6].name.replace(/\(\d\)/i,`(${reserves.length})`);
        embed.fields[6].value = `\`\`\`${this.convArrayToNewLines(reserves)}\`\`\``;

        // Edit RichEmbed with new values
        reaction.message.edit(new RichEmbed(embed))
            .then(msg => console.log('Activity updated.'))
            .catch(console.error);
    }

    convArrayToNewLines(array) {
        return array.join('\r\n');
    }
}

module.exports = MessageReactionRemove;