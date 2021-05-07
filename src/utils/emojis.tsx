import emoji, { EmojiProps } from 'emoji-datasource';

const filteredEmojis = emoji.filter((e) => !e['obsoleted_by']);

export const getFilteredEmojis = () => filteredEmojis;

export const getEmojisByCategory = (category: string) =>
  filteredEmojis.filter((e) => e.category === category);

export const getEmojiByUnifiedKey = (unified: string) => {
  const emojiFound = filteredEmojis.filter((e) => e.unified === unified);
  if (emojiFound.length === 0) {
    return undefined;
  }
  return emojiFound[0];
};

export const getEmojiByShortName = (name: string) => {
  const emojiFound = filteredEmojis.filter((e) => e.short_name === name);
  if (emojiFound.length === 0) {
    return undefined;
  }
  return emojiFound[0];
};

export const sortEmoji = (list: EmojiProps[]) => list.sort((a, b) => a.sort_order - b.sort_order);
