/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
  harmony: {
    white:"#F7F4F2",
    primary: "#2A9D8F",
    primarydark: "#141718", // Calming emerald green
    secondary: "#264653", // Deep peaceful blue-green
    accent: "#287271", // Muted teal accent
    light: "#8ECEC3", // Soft emerald highlight
    bg: "#F5F7F7", // Slightly tinted background
    // black: "#111111",       // Very dark black for text
    // 
    // 
    }
};
