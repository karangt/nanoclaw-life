/**
 * Re-exports from the Vercel Chat SDK ('chat' package).
 * Isolates the dependency to one file for easy swapping.
 */

// Markdown utilities
export {
  parseMarkdown,
  stringifyMarkdown,
  toPlainText,
  markdownToPlainText,
} from 'chat';

// Emoji utilities
export {
  convertEmojiPlaceholders,
  getEmoji,
  EmojiResolver,
  defaultEmojiResolver,
} from 'chat';

// Streaming
export { StreamingMarkdownRenderer } from 'chat';
