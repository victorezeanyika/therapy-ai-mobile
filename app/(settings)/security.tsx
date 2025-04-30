import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import TopHeader from "@/components/TopHeader";
import { Colors } from "@/constants/Colors";
import { View, SafeAreaView, TouchableOpacity } from "react-native";
import { Feather, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { router } from "expo-router";

const settingData = [
  {
    title: "Update your password",
    sub: "Set a new password",
    link: "/(settings)/update-password",
  },

];

export default function SecurityAndData() {

  return (
      <ThemedView style={{
        height:'100%',
        marginTop:20,
      }}>
        <TopHeader title="Security & Data" />
        <View style={{ padding: 20, gap: 15 }}>
          {settingData.map((item) => (
            <SettingCard
              key={item.title}
              title={item.title}
              sub={item.sub}
              red={item.red}
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
  red:boolean
};

export function SettingCard({ title, sub, icon, link , red}: SettingCardProps) {
  const iconSvg = useThemeColor({light:"#000", dark:"#fff"}, 'ds');


  const handlePress = () => {
    if (link === "Logout") {
      // Handle logout logic
      console.log("Logging out...");
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
