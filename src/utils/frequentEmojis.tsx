import AsyncStorage from '@react-native-async-storage/async-storage';
import { EmojiProps } from 'emoji-datasource';

import { getEmojiByShortName, getEmojiByUnifiedKey } from './emojis';

interface EmojiStoreProps {
  emoji: string; // use emoji.unified as the key
  count: number;
}

interface EmojiFrequencyProps {
  emoji: EmojiProps;
  count: number;
}

const DEFAULT_FREQUENCY = [
  'joy',
  'heart',
  'heart_eyes',
  'rolling_on_the_floor_laughing',
  'blush',
  'pray',
  'two_hearts',
  'sob',
  'kissing',
  '+1',
  'sweat_smile',
  'clap',
];
const STORAGE_KEY = '@react-native-emoji-selector:HISTORY';
const MAX_NUMBER_EMOJI_SHOWN = 40;
const MAX_RECENT_EMOJI = 6;
let isInitalised = false;
let frequentList: EmojiFrequencyProps[] = [];

/**
 * Initalise frequent Emoji list
 *   - If existing value is found in disk, save it as Frequent emoji list
 *   - Else, use @constant DEFAULT_FREQUENCY to pre-load a set of emojis to be used
 */
const init = async () => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEY);
    if (value != null) {
      // existing emoji storage found
      JSON.parse(value).map((item: EmojiStoreProps) => {
        const foundEmoji = getEmojiByUnifiedKey(item.emoji);
        if (foundEmoji) {
          frequentList.push({
            emoji: foundEmoji,
            count: item.count,
          });
        }
      });
    } else {
      // nothing is found, prepopulate with defaults
      DEFAULT_FREQUENCY.map((item) => {
        const defaultEmoji = getEmojiByShortName(item);
        if (defaultEmoji) {
          frequentList.push({
            emoji: defaultEmoji,
            count: 0,
          });
        }
      });
      await saveFrequentEmojis();
    }
    isInitalised = true;
  } catch (error) {
    console.error(error);
  }
};

/**
 * Returns an array of Emoji based on EmojiProps.
 * Maximum array size is based on @constant MAX_NUMBER_EMOJI_SHOWN
 * @returns EmojiProps[]
 */
const getFrequentEmojis = async () => {
  if (!isInitalised) {
    await init();
  }
  const limit = Math.min(frequentList.length, MAX_NUMBER_EMOJI_SHOWN);
  return frequentList.slice(0, limit).map((item) => item.emoji);
};

/**
 * Add the emoji requested by the user into the frequent Emoji list
 * @param newEmoji
 */
const setFrequentEmojis = async (newEmoji: EmojiProps) => {
  if (!isInitalised) {
    await init();
  }

  // check if emojiObject exist
  const frequentIndex = frequentList.findIndex(
    (frequentEmoji) => frequentEmoji.emoji.unified === newEmoji.unified,
  );

  // emoji exist, get the count and remove from frequentList
  let newCount = 1;
  if (frequentIndex >= 0) {
    newCount = frequentList[frequentIndex].count + 1;
    frequentList.splice(frequentIndex, 1);
  }

  // push the new count to the front of the frequentList for recents
  frequentList.unshift({
    emoji: newEmoji,
    count: newCount,
  });

  sortEmojis();
  await saveFrequentEmojis();
};

/**
 * Keep the first few emojis as defined by @constant MAX_RECENT_EMOJI,
 * and sort the remaining based on the most frequent ones used
 */
const sortEmojis = () => {
  const recentsEmoji = frequentList.splice(0, MAX_RECENT_EMOJI);
  frequentList.sort((a, b) => b.count - a.count);
  frequentList = [...recentsEmoji, ...frequentList];
};

/**
 * Save the frequent Emoji list to disk
 */
const saveFrequentEmojis = async () => {
  const value: EmojiStoreProps[] = frequentList.map((emojiObj) => ({
    emoji: emojiObj.emoji.unified,
    count: emojiObj.count,
  }));

  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch (error) {
    console.error(error);
  }
};

/**
 * Remove the frequent Emoji list from disk
 */
const resetFrequentEmojis = async () => {
  try {
    frequentList = [];
    isInitalised = false;
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error(error);
  }
};

export { getFrequentEmojis, resetFrequentEmojis, setFrequentEmojis };
