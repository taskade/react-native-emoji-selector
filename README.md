# react-native-emoji-selector

![Image preview](./assets/cover.png)

## Installation

```bash
npm install --save taskade/react-native-emoji-selector
```

```tsx
import EmojiSelector from 'react-native-emoji-selector'
```

## Demo
![Demo GIF](./assets/demo.gif)

## Usage

### Basic usage

```tsx
<EmojiSelector onEmojiSelected={emoji => console.log(emoji)} />
```

## Props

| Prop              | Type     | Default       | Description                                              |
| ----------------- | -------- | ------------- | -------------------------------------------------------- |
| onEmojiSelected   | _func_   |               | Function called when a user selects an Emoji             |
| showTabs          | _bool_   | `true`        | Toggle the tabs on or off                                |
| showSearchBar     | _bool_   | `true`        | Toggle the searchbar on or off                           |
| showHistory       | _bool_   | `false`       | Toggle the history tab on or off                         |
| showSectionTitles | _bool_   | `true`        | Toggle the section title elements                        |
| columns           | _number_ | `6`           | Number of columns accross                                |
| placeholder       | _string_ | `"Search"` | A string placeholder when there is no text in text input |
| darkMode          | _bool_   | `false`       | Toggle dark mode on or off                               |
| shouldInclude     | _func_   |               | Function called to check for emoji inclusion             |
| theme             | _object_ | See below   | Theme colors used for the emoji picker    |

### Theme

| Prop              | LIGHT_THEME   | DARK_THEME    | Description                                              |
| ----------------- | ------------- | ------------- | -------------------------------------------------------- |
| primary           | `"#007AFF"`   | `"#0A84FF"`   | Color used for loaders and active tab indicator           |
| background        | `"#FFFFFF"`   | `"#333333"`   | Color used for picker and header background               |
| label             | `"#8F8F8F"`   | `"#8F8F8F"`   | Color used for the header text                                |
| underlay          | `"#F0F0F0"`   | `"#424242"`   | Color used when an emoji is pressed                           |
| searchBackground  | `"#F2F2F7"`   | `"#48484A"`   | Color used for the search container                           |
| searchPlaceholder | `"#00000056"` | `"#FFFFFF56"` | Color used for the search placeholder                         |
| searchText        | `"#00000087"` | `"#FFFFFF87"` | Color used for search text                                |

## Contributors

Special thanks to everyone who has contributed to this project!

[![Victor K Varghese](https://avatars3.githubusercontent.com/u/15869386?s=80&v=4)](https://github.com/victorkvarghese)
[![Kubo](https://avatars3.githubusercontent.com/u/22464192?s=80&v=4)](https://github.com/ma96o)
[![Mateo Silguero](https://avatars3.githubusercontent.com/u/25598400?s=80&v=4)](https://github.com/mateosilguero)
[![Anastasiia Kravchenko](https://avatars3.githubusercontent.com/u/4223266?s=80&v=4)](https://github.com/St1ma)
[![Sindre](https://avatars3.githubusercontent.com/u/4065840?s=80&v=4)](https://github.com/sseppola)
[![Lucas Feijo](https://avatars3.githubusercontent.com/u/4157166?s=80&v=4)](https://github.com/lucasfeijo)
[![Amos Tan](https://avatars3.githubusercontent.com/u/8110786?s=80&v=4)](https://github.com/alphatrl)
