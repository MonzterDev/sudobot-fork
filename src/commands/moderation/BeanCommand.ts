import { BanOptions, CommandInteraction, GuildMember, Interaction, Message, User } from 'discord.js';
import BaseCommand from '../../utils/structures/BaseCommand';
import DiscordClient from '../../client/Client';
import CommandOptions from '../../types/CommandOptions';
import InteractionOptions from '../../types/InteractionOptions';
import MessageEmbed from '../../client/MessageEmbed';
import getUser from '../../utils/getUser';
import getMember from '../../utils/getMember';
import History from '../../automod/History';

export default class BeanCommand extends BaseCommand {
    supportsInteractions: boolean = true;

    constructor() {
        super('bean', 'moderation', []);
    }

    async run(client: DiscordClient, msg: Message | CommandInteraction, options: CommandOptions | InteractionOptions) {
        if (!options.isInteraction && typeof options.args[0] === 'undefined') {
            await msg.reply({
                embeds: [
                    new MessageEmbed()
                    .setColor('#f14a60')
                    .setDescription(`This command requires at least one argument.`)
                ]
            });

            return;
        }

        let user: GuildMember;
        let reason: string | undefined;

        if (options.isInteraction) {
            user = await <GuildMember> options.options.getMember('member');

            if (!user) {
                await msg.reply({
                    embeds: [
                        new MessageEmbed()
                        .setColor('#f14a60')
                        .setDescription("Invalid user given.")
                    ]
                });
    
                return;
            }

            if (options.options.getString('reason')) {
                reason = await <string> options.options.getString('reason');
            }
        }
        else {
            try {
                const user2 = await getMember((msg as Message), options);

                if (!user2) {
                    throw new Error('Invalid user');
                }

                user = user2;
            }
            catch (e) {
                await msg.reply({
                    embeds: [
                        new MessageEmbed()
                        .setColor('#f14a60')
                        .setDescription(`Invalid user given.`)
                    ]
                });
    
                return;
            }

            console.log(user);

            if (options.args[1]) {
                const args = [...options.args];
                args.shift();
                reason = await args.join(' ');
            }
        }

        try {            
            await History.create(user.id, msg.guild!, 'bean', msg.member!.user.id, typeof reason === 'undefined' ? null : reason);

            await user.send({
                embeds: [
                    new MessageEmbed()
                    .setAuthor({
                        iconURL: <string> msg.guild!.iconURL(),
                        name: `\tYou have been beaned in ${msg.guild!.name}`
                    })
                    .addFields([
                        {
                            name: "Reason",
                            value: typeof reason === 'undefined' ? '*No reason provided*' : reason
                        }
                    ])
                ]
            });

            await client.logger.logBeaned(user, typeof reason === 'undefined' ? '*No reason provided*' : reason, msg.member!.user as User);
        }
        catch (e) {
            console.log(e);            
        }

        await msg.reply({
            embeds: [
                new MessageEmbed()
                .setAuthor({
                    name: user.user.tag,
                    iconURL: user.user.displayAvatarURL(),
                })
                .setDescription(user.user.tag + " has been beaned.")
                .addFields([
                    {
                        name: "Beaned by",
                        value: (msg.member!.user as User).tag
                    },
                    {
                        name: "Reason",
                        value: reason === undefined ? "*No reason provided*" : reason
                    }
                ])
            ]
        });
    }
}