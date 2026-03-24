import { createDiscordAdapter } from '@chat-adapter/discord';

import { registerChatAdapter } from '../chat-adapter-bridge.js';

registerChatAdapter('discord', () => {
  if (!process.env.CSDK_DISCORD_BOT_TOKEN) return null;
  return createDiscordAdapter({
    botToken: process.env.CSDK_DISCORD_BOT_TOKEN,
    publicKey: process.env.CSDK_DISCORD_PUBLIC_KEY!,
  });
});
