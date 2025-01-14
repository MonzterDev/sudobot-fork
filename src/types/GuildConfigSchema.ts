/**
 * This file is part of SudoBot.
 *
 * Copyright (C) 2021-2023 OSN Developers.
 *
 * SudoBot is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * SudoBot is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with SudoBot. If not, see <https://www.gnu.org/licenses/>.
 */

import { z } from "zod";
import { MessageRuleSchema } from "./MessageRuleSchema";
import { zSnowflake } from "./SnowflakeSchema";
import { TriggerSchema } from "./TriggerSchema";

export const GuildConfigSchema = z.object({
    prefix: z.string().default("-"),
    commands: z
        .object({
            mention_prefix: z.boolean().default(true),
            bean_safe: z.array(zSnowflake).default([]),
            shot_safe: z.array(zSnowflake).default([]),
            fakeban_safe: z.array(zSnowflake).default([])
        })
        .default({}),
    permissions: z
        .object({
            mod_role: zSnowflake.optional(),
            admin_role: zSnowflake.optional(),
            staff_role: zSnowflake.optional(),
            mode: z
                .union([z.literal("discord"), z.literal("levels"), z.literal("advanced")])
                .default("discord")
                .optional()
        })
        .optional()
        .default({}),
    infractions: z
        .object({
            send_ids_to_user: z.boolean().default(true),
            dm_fallback: z.enum(["none", "create_channel", "create_thread"]).default("none"),
            dm_fallback_parent_channel: zSnowflake.optional(),
            dm_fallback_channel_expires_in: z.number().int().optional().default(604800000) // 1 week
        })
        .optional(),
    muting: z
        .object({
            role: zSnowflake.optional()
        })
        .optional(),
    quickmute: z
        .object({
            enabled: z.boolean().optional().default(false),
            clear_emoji: z.string().optional(),
            noclear_emoji: z.string().optional(),
            duration: z
                .number()
                .int()
                .min(0)
                .default(1000 * 60 * 60 * 2)
                .optional(),
            reason: z.string().optional()
        })
        .optional(),
    logging: z
        .object({
            enabled: z.boolean().default(false),
            bulk_delete_send_json: z.boolean().default(true),
            primary_channel: zSnowflake.optional(),
            message_logging_channel: zSnowflake.optional(),
            join_leave_channel: zSnowflake.optional(),
            saved_messages_channel: zSnowflake.optional(),
            events: z
                .object({
                    message_edit: z.boolean().default(true),
                    message_delete: z.boolean().default(true),
                    member_join: z.boolean().default(true),
                    member_leave: z.boolean().default(true),
                    message_bulk_delete: z.boolean().default(true)
                })
                .default({
                    message_edit: true,
                    member_leave: true,
                    member_join: true,
                    message_delete: true
                })
        })
        .optional(),
    message_reporting: z
        .object({
            enabled: z.boolean().default(false),
            channel: zSnowflake.optional(),
            users: z.array(zSnowflake).default([]),
            roles: z.array(zSnowflake).default([]),
            permissions: z.array(z.string()).default([]),
            permissionLevel: z.number().int().min(-1).max(100).default(-1).optional()
        })
        .optional(),
    invite_tracking: z
        .object({
            enabled: z.boolean().default(false)
        })
        .optional(),
    message_filter: z
        .object({
            enabled: z.boolean().default(false),
            send_logs: z
                .boolean()
                .or(
                    z.object({
                        blocked_words: z.boolean().default(false),
                        blocked_tokens: z.boolean().default(false),
                        blocked_messages: z.boolean().default(false),
                    })
                )
                .default(false),
            delete_message: z
                .boolean()
                .or(
                    z.object({
                        blocked_words: z.boolean().default(false),
                        blocked_tokens: z.boolean().default(false),
                        blocked_messages: z.boolean().default(false),
                    })
                )
                .default(false),
            data: z
                .object({
                    blocked_words: z.array(z.string()).optional().default([]),
                    blocked_tokens: z.array(z.string()).optional().default([]),
                    blocked_messages: z.array(z.string()).optional().default([]),
            })
            .default({})
        })
        .optional(),
    antispam: z
        .object({
            enabled: z.boolean().optional().default(false),
            limit: z.number().int().default(-1).optional(),
            timeframe: z.number().int().default(-1).optional(),
            mute_duration: z.number().int().default(-1).optional(),
            action: z
                .union([
                    z.literal("verbal_warn"),
                    z.literal("warn"),
                    z.literal("warn"),
                    z.literal("mute"),
                    z.literal("mute_clear"),
                    z.literal("auto")
                ])
                .optional()
        })
        .optional(),
    antiraid: z
        .object({
            enabled: z.boolean().optional().default(false),
            max_joins: z.number().int().default(-1).optional(),
            timeframe: z.number().int().default(-1).optional(),
            action: z
                .union([
                    z.literal("auto"),
                    z.literal("lock"),
                    z.literal("antijoin"),
                    z.literal("lock_and_antijoin"),
                    z.literal("none")
                ])
                .optional(),
            send_log: z.boolean().optional().default(true),
            channels: z.array(zSnowflake).default([]),
            channel_mode: z.literal("exclude").or(z.literal("include")).default("exclude"),
            ignore_private_channels: z.boolean().optional().default(true)
        })
        .optional(),
    welcomer: z
        .object({
            enabled: z.boolean().optional().default(false),
            custom_message: z.string().optional(),
            randomize: z.boolean().optional().default(false),
            mention: z.boolean().optional().default(false),
            say_hi_button: z.boolean().optional().default(false),
            say_hi_emoji: z.string().optional().default("default"),
            say_hi_expire_after: z
                .number()
                .int()
                .min(5_000)
                .max(10 * 60_000)
                .default(5 * 60_000)
                .nullable(),
            delete_messages: z
                .number()
                .int()
                .min(5_000)
                .max(10 * 60_000)
                .nullable()
                .default(null),
            channel: zSnowflake,
            embed: z.boolean().optional().default(true),
            color: z.number().int().min(0x000000).max(0xffffff).default(0x007bff).or(z.string().startsWith("#"))
        })
        .optional(),
    profile_filter: z
        .object({
            enabled: z.boolean().optional().default(false),
            scan: z.array(z.literal("status").or(z.literal("nickname")).or(z.literal("username"))).default([]),
            actions: z
                .object({
                    status: z.literal("mute").or(z.literal("warn")).or(z.literal("none")).default("none"),
                    nickname: z.literal("mute").or(z.literal("warn")).or(z.literal("none")).default("none"),
                    username: z.literal("mute").or(z.literal("warn")).or(z.literal("none")).default("none")
                })
                .default({})
                .optional(),
            inherit_from_message_filter: z
                .object({
                    tokens: z.boolean().optional().default(false),
                    words: z.boolean().optional().default(false)
                })
                .default({})
                .optional(),
            tokens: z.array(z.string()).default([]).optional(),
            words: z.array(z.string()).default([]).optional()
        })
        .optional(),
    autorole: z
        .object({
            enabled: z.boolean().optional().default(false),
            roles: z.array(zSnowflake).default([]),
            ignore_bots: z.boolean().optional().default(true)
        })
        .optional(),
    reaction_roles: z
        .object({
            enabled: z.boolean().optional().default(false),
            ignore_bots: z.boolean().optional().default(true)
        })
        .optional(),
    create_boost_role: z
        .object({
            create_roles_after: zSnowflake.optional()
        })
        .optional(),
    disabled_commands: z
        .object({
            guild: z.array(z.string()).default([]),
            channels: z.record(zSnowflake, z.array(z.string()).default([])).default({})
        })
        .optional(),
    file_filter: z
        .object({
            enabled: z.boolean().optional().default(false),
            disabled_channels: z.array(zSnowflake).default([]),
            blocked_hashes: z.record(z.string(), z.string().nullable()).default({})
        })
        .optional(),
    message_rules: z
        .object({
            enabled: z.boolean().default(false),
            rules: z.array(MessageRuleSchema).default([]),
            global_disabled_channels: z.array(zSnowflake).default([])
        })
        .optional(),
    auto_triggers: z
        .object({
            enabled: z.boolean().default(false),
            triggers: z.array(TriggerSchema).default([]),
            global_disabled_channels: z.array(zSnowflake).default([])
        })
        .optional()
});

export type GuildConfig = z.infer<typeof GuildConfigSchema>;
