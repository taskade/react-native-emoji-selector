declare module 'emoji-datasource' {
  export interface EmojiProps {
    name: string;
    unified: string;
    docomo: string | null;
    au: string | null;
    softbank: string | null;
    google: string | null;
    image: string;
    sheet_x: number;
    sheet_y: number;
    short_name: string;
    short_names: string[];
    text: string | null;
    texts: string[] | null;
    category: string;
    sort_order: number;
    added_in: string;
    has_img_apple: boolean;
    has_img_google: boolean;
    has_img_twitter: boolean;
    has_img_facebook: boolean;
    skin_variations?: Record<
      string,
      {
        unified: string;
        non_qualified: string;
        image: string;
        sheet_x: number;
        sheet_y: number;
        added_in: string;
        has_img_apple: boolean;
        has_img_google: boolean;
        has_img_twitter: boolean;
        has_img_facebook: boolean;
      }
    >;
    obsoleted_by?: string;
    obsoletes?: string;
  }

  const Emoji: EmojiProps[];

  export default Emoji;
}
