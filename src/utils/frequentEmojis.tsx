import AsyncStorage from '@react-native-async-storage/async-storage';
import { EmojiProps } from 'emoji-datasource';

import { getEmojiByShortName, getEmojiByUnifiedKey } from './emojis';

interface EmojiStoreProps {
  emoji: string; // use emoji.unified as the key
  count: number;
}

interface EmojiFrequentProps {
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
const storage_key = '@react-native-emoji-selector:HISTORY';
const frequentList: EmojiFrequentProps[] = [];
let isInitalised = false;

const init = async () => {
  try {
    const value = await AsyncStorage.getItem(storage_key);
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
      // save here
    }
    isInitalised = true;
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const getFrequentEmojis = async () => {
  if (!isInitalised) {
    await init();
  }
  // return only the emoji, without the count
  return frequentList.map((item) => item.emoji);
};

export { getFrequentEmojis };
