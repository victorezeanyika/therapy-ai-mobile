import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/theme-context'; // <-- use your context instead

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const { theme } = useTheme(); // ← Now using custom theme context
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}
