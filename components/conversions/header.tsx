import { View, Text } from "react-native";
import { ThemedText } from "../ThemedText";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function ConversationsHeader({stats}: {stats: any}) {
    const iconColor = useThemeColor({ light: '#000000', dark: '#FFFFFF' }, 'icon');

    return (
        <View style={{
            marginTop:20,
            paddingHorizontal: 30,
            alignItems: 'center',
          }}>
            <View style={{
              justifyContent: 'center',
              alignItems: 'center',
              gap: 10,
            }}>
              <ThemedText
                type='very-big'
                style={{
                  fontSize: 96,
                  height: 100,
                  fontWeight: 'bold',
                  fontFamily: 'Gotham-Bold',
                }}>
                <Text>{stats?.used}</Text>
              </ThemedText>
              <ThemedText 
                style={{
                  fontSize: 20,
                }}>
                <Text>Total Conversations</Text>
              </ThemedText>
            </View>
    
            <View style={{ marginTop: 32, flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'space-between', width: '100%' }}>
                <View style={{alignItems: 'center', gap: 10}}>
                    <View style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
                        <MaterialCommunityIcons name="robot" size={24} color={iconColor} />  
                        <ThemedText
                            style={{
                                fontSize: 24,
                                fontWeight: 'bold',
                            }}>
                            <Text>{stats?.remaining}</Text>
                        </ThemedText>
                    </View>     
                    <ThemedText
                        type='defaultSemiBold'
                        style={{
                            fontSize: 14,
                        }}>
                        <Text>Left this month</Text>
                    </ThemedText>
                </View>
    
                <View style={{alignItems: 'center', gap: 10}}>
                    <View style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
                        <MaterialIcons name="insights" size={24} color={iconColor} />
                        <ThemedText
                            style={{
                                fontSize: 24,
                                fontWeight: 'bold',
                            }}>
                            <Text>{stats?.sessionDurationMinutes} mins</Text>
                        </ThemedText>
                    </View>     
                    <ThemedText
                        type='defaultSemiBold'
                        style={{
                            fontSize: 14,
                        }}>
                        <Text>Response & Support</Text>
                    </ThemedText>
                </View>
            </View>
        </View>
    );
}