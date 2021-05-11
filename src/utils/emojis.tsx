import emoji, { EmojiProps } from 'emoji-datasource';

const filteredEmojis = emoji.filter((e) => !e['obsoleted_by']);

export const getFilteredEmojis = () => filteredEmojis;

export const getEmojisByCategory = (category: string) =>
  filteredEmojis.filter((e) => e.category === category);

export const getEmojiByUnifiedKey = (unified: string) => {
  return filteredEmojis.find((e) => e.unified === unified);
};

export const getEmojiByShortName = (name: string) => {
  return filteredEmojis.find((e) => e.short_name === name);
};

export const sortEmoji = (list: EmojiProps[]) => list.sort((a, b) => a.sort_order - b.sort_order);
