// convert unicode to emoji 
const charFromUtf16 = (utf16) => String.fromCodePoint(...utf16.split("-").map(u => "0x" + u));
export const charFromEmojiObject = obj => charFromUtf16(obj.unified)

