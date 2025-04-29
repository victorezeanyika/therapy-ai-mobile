import { Fontisto } from "@expo/vector-icons";
import { FlatList, View, Image } from "react-native";
import { ThemedText } from "../ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedView } from "../ThemedView";
import { useGetActivitiesQuery } from "@/features/journal-api";
const data = [
  {
    id: "1",
    title: "Recent Breakup, felt sad as hell... 💔",
    mood: "Sad",
    emoji: "😔",
    icon: require("../../assets/images/icon1.png"), // replace with your real local asset
  },
  {
    id: "2",
    title: "Just wanna stop existing",
    mood: "Amazing",
    emoji: "😌",
    icon: require("../../assets/images/icon1.png"), // replace with your real local asset
  },
  {
    id: "3",
    title: "Shitty Teacher at University",
    mood: "Happy",
    emoji: "😊",
    icon: require("../../assets/images/icon1.png"), // replace with your real local asset
  },
];

export default function Recents() {
  const { data: activities, isLoading, error } = useGetActivitiesQuery();
  const iconColor = useThemeColor({ light: '#000000', dark: '#FFFFFF' }, 'icon');
  console.log(activities);
  return (
    <View style={{ flex: 1, paddingHorizontal: 30 }}>
      {/* Top Header */}
      <View
        style={{
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row",
          marginTop: 32,
        }}
      >
        <ThemedText>Recent ({data.length})</ThemedText>
        <View 
         style={{ flexDirection: "row",
         alignItems: "center", gap: 10, borderWidth: 1,
         borderColor: iconColor,
         paddingHorizontal: 10, 
         paddingVertical: 5,
         borderRadius: 20
          }}>
          <Fontisto name="date" size={16} color={iconColor} />
          <ThemedText style={{fontSize: 16}}>Newest</ThemedText>
        </View>
      </View>

      {/* FlatList */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        style={{ marginTop: 20 }}
        renderItem={({ item }) => (
          <ThemedView
          darkColor="#232627"
            style={{
              width: '100%',
              height: 125,
              borderRadius: 15,
              padding: 16,
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Image
              source={item.icon}
              style={{
                width: 64,
                height: 64,
                borderRadius: 24,
                marginRight: 16,
              }}
            />
            <View style={{ flex: 1 }}>
              <ThemedText style={{ color: "white", fontSize: 16 }}>
                {item.title}
              </ThemedText>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 4,
                }}
              >
                <ThemedText style={{ color: "#aaa", fontSize: 14 }}>
                  {item.emoji} {item.mood}
                </ThemedText>
              </View>
            </View>
          </ThemedView>
        )}
      />
    </View>
  );
}
