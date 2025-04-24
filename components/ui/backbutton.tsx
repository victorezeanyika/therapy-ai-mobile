import { Feather } from "@expo/vector-icons";
import { TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function BackButton() {
  const borderColor = useThemeColor({ light: "#000000", dark: "#FFFFFF" });

  return (
    <TouchableOpacity
      onPress={() => router.back()}
      style={[styles.button, { borderColor }]}
    >
      <Feather name="arrow-left" size={20} color={borderColor} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    width: 48,
    height: 48,
    borderWidth: 1,
  },
});
