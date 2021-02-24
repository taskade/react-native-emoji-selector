import emoji, { EmojiProps } from 'emoji-datasource';

export interface CategoryTypeProps {
  symbol: string;
  name: string;
}

const CATEGORIES: Record<string, CategoryTypeProps> = {
  history: {
    symbol: '🕘',
    name: 'Frequently Used',
  },
  emotion: {
    symbol: '😀',
    name: 'Smileys & Emotion',
  },
  people: {
    symbol: '🧑',
    name: 'People & Body',
  },
  nature: {
    symbol: '🦄',
    name: 'Animals & Nature',
  },
  food: {
    symbol: '🍔',
    name: 'Food & Drink',
  },
  activities: {
    symbol: '⚾️',
    name: 'Activities',
  },
  places: {
    symbol: '✈️',
    name: 'Travel & Places',
  },
  objects: {
    symbol: '💡',
    name: 'Objects',
  },
  symbols: {
    symbol: '🔣',
    name: 'Symbols',
  },
  flags: {
    symbol: '🏳️‍🌈',
    name: 'Flags',
  },
};

const CATEGORIES_KEYS = Object.keys(CATEGORIES);

const filteredEmojis = emoji.filter((e) => !e['obsoleted_by']);

const getFilteredEmojis = () => filteredEmojis;

/**
 * Returns an array of emoji-datasource objects based on the category
 * @param category string
 * @returns
 */
const getEmojisByCategory = (category: string) =>
  filteredEmojis.filter((e) => e.category === category);

/**
 * Find emoji-datasource object by their unified key
 * @param unified string
 * @returns
 */
const getEmojiByUnifiedKey = (unified: string) => {
  return filteredEmojis.find((e) => e.unified === unified);
};

/**
 * Find emoji-datasource object by their short_name
 * @param name
 * @returns
 */
const getEmojiByShortName = (name: string) => {
  return filteredEmojis.find((e) => e.short_name === name);
};

/**
 * Sort emoji list by their sort_order
 * @param list EmojiProps[]
 * @returns
 */
const sortEmoji = (list: EmojiProps[]) => list.sort((a, b) => a.sort_order - b.sort_order);

/**
 * Convert unicode to emoji character
 * @param utf16
 * @returns 😝
 */
const charFromUtf16 = (utf16: string) =>
  String.fromCodePoint(...utf16.split('-').map((u) => parseInt('0x' + u)));

/**
 * Returns emoji character from emoji-datasource object
 * @param EmojiObj: EmojiProps
 * @returns 😝
 */
const charFromEmojiObject = (emojiObj: EmojiProps) => charFromUtf16(emojiObj.unified);

/**
 * Returns a matrix of emoji-datasource object based on columnSize
 * @param EmojiObj: EmojiProps[][]
 * @returns 😝
 */
const sliceEmojiToRows = (array: EmojiProps[] = filteredEmojis, colSize: number) => {
  const slicedArray = [];
  for (let i = 0; i < array.length; i += colSize) {
    slicedArray.push(array.slice(i, i + colSize));
  }
  return slicedArray;
};

export {
  CATEGORIES,
  CATEGORIES_KEYS,
  charFromEmojiObject,
  getEmojiByShortName,
  getEmojiByUnifiedKey,
  getEmojisByCategory,
  getFilteredEmojis,
  sliceEmojiToRows,
  sortEmoji,
};
