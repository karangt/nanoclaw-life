import { describe, it, expect, vi, beforeEach } from 'vitest';

// We test the module-level registration and JID mapping by importing internals.
// The bridge registers itself as a channel factory on import,
// so we test via the registry.

// Reset module state between tests
beforeEach(() => {
  vi.resetModules();
});

function createMockAdapterFields() {
  return {
    name: 'test',
    userName: 'testbot',
    postMessage: vi.fn(),
    editMessage: vi.fn(),
    deleteMessage: vi.fn(),
    addReaction: vi.fn(),
    removeReaction: vi.fn(),
    startTyping: vi.fn(),
    handleWebhook: vi.fn(),
    initialize: vi.fn(),
    fetchMessages: vi.fn(),
    fetchThread: vi.fn(),
    parseMessage: vi.fn(),
    renderFormatted: vi.fn(),
    encodeThreadId: vi.fn(),
    decodeThreadId: vi.fn(),
    channelIdFromThreadId: vi.fn(),
  };
}

describe('chat-adapter-bridge', () => {
  describe('registerChatAdapter + channel factory', () => {
    it('returns null when no adapters are configured', async () => {
      const { getChannelFactory } = await import('./registry.js');
      // Import the bridge to trigger registration
      await import('./chat-adapter-bridge.js');

      const factory = getChannelFactory('chat-sdk');
      expect(factory).toBeDefined();

      const channel = factory!({
        onMessage: vi.fn(),
        onChatMetadata: vi.fn(),
        registeredGroups: () => ({}),
      });

      // No adapters registered → returns null
      expect(channel).toBeNull();
    });

    it('creates a channel when an adapter is registered', async () => {
      const { registerChatAdapter } = await import('./chat-adapter-bridge.js');

      const mockAdapter = createMockAdapterFields();

      registerChatAdapter('test', () => mockAdapter);

      const { getChannelFactory } = await import('./registry.js');
      const factory = getChannelFactory('chat-sdk');
      expect(factory).toBeDefined();

      const channel = factory!({
        onMessage: vi.fn(),
        onChatMetadata: vi.fn(),
        registeredGroups: () => ({}),
      });

      expect(channel).not.toBeNull();
      expect(channel!.name).toBe('chat-sdk');
    });

    it('skips adapters whose factory returns null', async () => {
      const { registerChatAdapter } = await import('./chat-adapter-bridge.js');

      registerChatAdapter('missing-env', () => null);

      const { getChannelFactory } = await import('./registry.js');
      const factory = getChannelFactory('chat-sdk');
      const channel = factory!({
        onMessage: vi.fn(),
        onChatMetadata: vi.fn(),
        registeredGroups: () => ({}),
      });

      expect(channel).toBeNull();
    });

    it('skips adapters whose factory throws', async () => {
      const { registerChatAdapter } = await import('./chat-adapter-bridge.js');

      registerChatAdapter('broken', () => {
        throw new Error('Missing credentials');
      });

      const { getChannelFactory } = await import('./registry.js');
      const factory = getChannelFactory('chat-sdk');
      const channel = factory!({
        onMessage: vi.fn(),
        onChatMetadata: vi.fn(),
        registeredGroups: () => ({}),
      });

      expect(channel).toBeNull();
    });
  });

  describe('ChatSdkChannel interface', () => {
    it('ownsJid matches csdk: prefix', async () => {
      const { registerChatAdapter } = await import('./chat-adapter-bridge.js');

      const mockAdapter = createMockAdapterFields();

      registerChatAdapter('test', () => mockAdapter);

      const { getChannelFactory } = await import('./registry.js');
      const factory = getChannelFactory('chat-sdk');
      const channel = factory!({
        onMessage: vi.fn(),
        onChatMetadata: vi.fn(),
        registeredGroups: () => ({}),
      });

      expect(channel!.ownsJid('csdk:test:thread123')).toBe(true);
      expect(channel!.ownsJid('tg:123')).toBe(false);
      expect(channel!.ownsJid('group@g.us')).toBe(false);
    });

    it('isConnected returns false before connect', async () => {
      const { registerChatAdapter } = await import('./chat-adapter-bridge.js');

      registerChatAdapter('test', () => createMockAdapterFields());

      const { getChannelFactory } = await import('./registry.js');
      const factory = getChannelFactory('chat-sdk');
      const channel = factory!({
        onMessage: vi.fn(),
        onChatMetadata: vi.fn(),
        registeredGroups: () => ({}),
      });

      expect(channel!.isConnected()).toBe(false);
    });
  });
});
