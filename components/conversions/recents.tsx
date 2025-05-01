import { Fontisto } from "@expo/vector-icons";
import { FlatList, View, Image, TouchableOpacity, Text } from "react-native";
import { ThemedText } from "../ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedView } from "../ThemedView";
import { useGetActivitiesQuery } from "@/features/journal-api";
import { useGetAllSessionsQuery, useGetAllSessionsBasicQuery } from "@/features/chat-api";
import { router } from "expo-router";

export default function Recents({sessions}: {sessions: any}) {
  const iconColor = useThemeColor({ light: '#000000', dark: '#FFFFFF' }, 'icon');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleSessionPress = (entryId: string) => {
    router.push(`/chat-detail?sessionId=${entryId}`);
  };

  return (
    <View style={{ flex: 1, paddingHorizontal: 30 }}>
      <View style={{
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        marginTop: 32,
      }}>
        <ThemedText><Text>Recent ({sessions?.length})</Text></ThemedText>
        <View style={{ 
          flexDirection: "row",
          alignItems: "center", 
          gap: 10, 
          borderWidth: 1,
          borderColor: iconColor,
          paddingHorizontal: 10, 
          paddingVertical: 5,
          borderRadius: 20
        }}>
          <Fontisto name="date" size={16} color={iconColor} />
          <ThemedText style={{fontSize: 16}}><Text>Newest</Text></ThemedText>
        </View>
      </View>

      <FlatList
        data={sessions}
        keyExtractor={(item) => item.entryId}
        style={{ marginTop: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleSessionPress(item.entryId)}
            activeOpacity={0.8}
          >
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
                source={require("../../assets/images/icon1.png")}
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 24,
                  marginRight: 16,
                }}
              />
              <View style={{ flex: 1 }}>
                <ThemedText 
                  style={{ 
                    color: "white", 
                    fontSize: 16,
                    marginBottom: 8 
                  }}
                  numberOfLines={2}
                >
                  <Text>{item?.messages?.[0]?.content || 'No message content'}</Text>
                </ThemedText>
                <View style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 4,
                }}>
                  <ThemedText style={{ color: "#aaa", fontSize: 14 }}>
                    <Text>{formatDate(item.sessionEndTime)}</Text>
                  </ThemedText>
                </View>
              </View>
            </ThemedView>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}