import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import TopHeader from "@/components/TopHeader";
import { Colors } from "@/constants/Colors";
import { View, SafeAreaView, TouchableOpacity } from "react-native";
import { Feather, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import { logout } from "@/features/auth-slice";

const settingData = [
  {
    title: "Account Info",
    sub: "Edit your personal info",
    icon: <Feather name="user" size={20} color="white" />,
    link: "/(settings)/accountinfo",
  },
  {
    title: "Security & Data",
    sub: "Manage all of your personal information",
    icon: <MaterialIcons name="security" size={20} color="white" />,
    link: "/(settings)/security",
  },
  {
    title: "App Theme",
    sub: "Swap the app theme to dark mode",
    icon: <Ionicons name="moon" size={20} color="white" />,
    link: "/(settings)/app-theme",
  },
  {
    title: "Log out",
    sub: "Log out of this device",
    icon: <MaterialIcons name="logout" size={20} color="white" />,
    link: "Logout", 
  },
];

export default function SettingsPage() {
  const dispatch = useDispatch();

  return (
      <ThemedView style={{
        height:'100%',
        marginTop:20,
      }}>
        <TopHeader title="Settings" />
        <View style={{ padding: 20, gap: 15 }}>
          {settingData.map((item) => (
            <SettingCard
              key={item.title}
              title={item.title}
              sub={item.sub}
              icon={item.icon}
              link={item.link}
            />
          ))}
        </View>
      </ThemedView>
  );
}

type SettingCardProps = {
  title: string;
  sub: string;
  icon: React.ReactNode;
  link: string;
};

export function SettingCard({ title, sub, icon, link }: SettingCardProps) {
  const dispatch = useDispatch();

  const handlePress = () => {
    if (link === "Logout") {
      dispatch(logout());
      router.replace("/(auth)");
    } else {
      router.push(link as never);
    }
  };

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
          gap: 12,
        }}
      >
        <View
          style={{
            backgroundColor: Colors.harmony.primary,
            width: 43,
            height: 43,
            borderRadius: 15,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {icon}
        </View>
        <View>
          <ThemedText
            style={{
              fontSize: 12,
              fontFamily: "Gotham",
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
      </ThemedView>
    </TouchableOpacity>
  );
}
