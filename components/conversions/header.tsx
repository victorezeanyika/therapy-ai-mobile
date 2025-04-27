import { View } from "react-native";
import { ThemedText } from "../ThemedText";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function ConversationsHeader() {
    const iconColor = useThemeColor({ light: '#000000', dark: '#FFFFFF' }, 'icon');

    return (
        <View style={{
            // justifyContent: 'center',
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
                fontFamily: 'Gotham-Bold', // Make sure it's correctly 'Gotham-Bold' not 'Gotham-bold'
              }}>
                1571
              </ThemedText>
              <ThemedText 
              style={{
                fontSize: 20,
              }}>
                Total Conversations
              </ThemedText>
            </View>
    
            <View style={{ marginTop: 32, flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'space-between', width: '100%' }}>
                <View style={{alignItems: 'center', gap: 10}}>
                    <View style={{flexDirection: 'row', gap: 10, alignItems: 'center',}}>
                    <MaterialCommunityIcons name="robot" size={24} color={iconColor} />  
                    <ThemedText
                    style={{
                        fontSize: 24,
                        fontWeight: 'bold',
                    }}>
                        32
                    </ThemedText>
                    </View>     
                    <ThemedText
                    type='defaultSemiBold'
                    style={{
                        fontSize: 14,
                    }}>
                        Left this month
                    </ThemedText>
                </View>
    
                <View style={{alignItems: 'center', gap: 10}}>
                    <View style={{flexDirection: 'row', gap: 10, alignItems: 'center',}}>
                    <MaterialIcons name="insights" size={24} color={iconColor} />                <ThemedText
                    style={{
                        fontSize: 24,
                        fontWeight: 'bold',
                    }}>
                        Slow
                    </ThemedText>
                    </View>     
                    <ThemedText
                    type='defaultSemiBold'
                    style={{
                        fontSize: 14,
                    }}>
                     Response & Support
                    </ThemedText>
                </View>
    
    
               
            </View>
          </View>
    )
}