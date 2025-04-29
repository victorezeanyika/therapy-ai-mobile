import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import TopHeader from "@/components/TopHeader";
import { Colors } from "@/constants/Colors";
import { View, TouchableOpacity, Switch } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useSubmitUserPreferencesMutation } from "@/features/auth-api";
import { useToast } from "@/context/toast-context";
import { useTheme } from "@/context/theme-context";

const settingData = [
  {
    title: "Change colour of app",
    sub: "Light mode and dark mode",
  },

];

export default function AppTheme() {
  const { theme, setTheme } = useTheme();
  const [submitUserPreferences] = useSubmitUserPreferencesMutation();
  const { success, error: toastError } = useToast();
  const isDarkMode = theme === 'dark';

  const handleThemeChange = async (value: boolean) => {
    try {
      const newTheme = value ? 'dark' : 'light';
      setTheme(newTheme);
      await submitUserPreferences({
        notifications: true,
        theme: newTheme,
        language: "en",
        reminderFrequency: "daily"
      });
      success("Theme updated successfully");
    } catch (error) {
      toastError("Failed to update theme");
      console.error("Failed to update theme:", error);
    }
  };

  return (
    <ThemedView style={{
      height: '100%',
      marginTop: 20,
    }}>
      <TopHeader title="App Theme" />
      <View style={{ padding: 20, gap: 15 }}>
        <ThemedView
          darkColor="#232627"
          style={{
            padding: 15,
            borderRadius: 20,
            borderWidth: 0.5,
            borderColor: "#F2F2F2",
            height: 68,
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <View>
            <ThemedText
              darkColor="#FFFFFF"
              lightColor="#000000"
              style={{
                fontSize: 12,
                fontFamily: "Gotham",
              }}
            >
              Dark Mode
            </ThemedText>
            <ThemedText
              darkColor="#FFFFFF80"
              type="subtitle"
              style={{
                fontSize: 11,
                lineHeight: 21,
                fontFamily: "Gotham",
                fontWeight: "400",
              }}
            >
              Switch between light and dark mode
            </ThemedText>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={handleThemeChange}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isDarkMode ? "#2A9D8F" : "#f4f3f4"}
          />
        </ThemedView>
      </View>
    </ThemedView>
  );
}

type SettingCardProps = {
  title: string;
  sub: string;
  icon: React.ReactNode;
  link: string;
  red:boolean
};

export function SettingCard({ title, sub, icon, link , red}: SettingCardProps) {
  const iconSvg = useThemeColor({light:"#000", dark:"#fff"}, 'ds');


  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.9}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <ThemedView
        darkColor="#232627"
        style={{
          padding: 15,
          borderRadius: 20,
          borderWidth: 0.5,
          borderColor: "#F2F2F2",
          height: 68,
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent:'space-between',
          gap: 12,
        }}
      >
        
        <View>
          <ThemedText
          darkColor="#FFFFFF"
          lightColor="#000000"
            style={{
              fontSize: 12,
              fontFamily: "Gotham",
              // color:red ? "red": "",
            }}
          >
            {title}
          </ThemedText>
          <ThemedText
            darkColor="#FFFFFF80"
            type="subtitle"
            style={{
              fontSize: 11,
              lineHeight: 21,
              fontFamily: "Gotham",
              fontWeight: "400",
            }}
          >
            {sub}
          </ThemedText>
        </View>
        <View
          style={{
            width: 43,
            height: 43,
            borderRadius: 15,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MaterialIcons 
          name="chevron-right"
          size={24}
          color={iconSvg}
          />
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
}
