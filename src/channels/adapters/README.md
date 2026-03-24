# Chat SDK Adapters

Each file in this directory registers a Chat SDK adapter via `registerChatAdapter()`.

These are ~5-line config files. All adapter logic lives in `../chat-adapter-bridge.ts`.

To add a new platform:

1. `npm install @chat-adapter/{platform}`
2. Create `{platform}.ts` here with the adapter factory
3. Import it in `../index.ts`
4. Set the required env vars
