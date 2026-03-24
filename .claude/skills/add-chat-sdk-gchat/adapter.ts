import { createGoogleChatAdapter } from '@chat-adapter/gchat';

import { registerChatAdapter } from '../chat-adapter-bridge.js';

registerChatAdapter('gchat', () => {
  const creds = process.env.CSDK_GCHAT_CREDENTIALS;
  if (!creds) return null;
  return createGoogleChatAdapter({
    credentials: JSON.parse(creds),
  });
});
