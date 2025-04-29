import { StyleSheet, TouchableOpacity } from "react-native";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";


export default function UpcommingSession() {
    return (
        <ThemedView 
        lightColor='#fff'
        darkColor='#232627'
        style={styles.container}>
            <ThemedText
            type="title"
            style={{
                fontSize: 15,
            }}
            >Upcoming Session</ThemedText>
            <ThemedText
            type="subtitle"
            style={{
                textAlign: 'center',
                fontSize: 12,
            }}
            >
                You have a session coming up in few hours, 
                so be sure to prepare and make the most of the time before it begins.
            </ThemedText>
            <TouchableOpacity
            style={styles.button}
            onPress={() => {
                router.push('/chat-detail');
            }}
            >
                <ThemedText
                type="subtitle"
                style={{
                    fontSize: 12,
                    color: '#fff',
                    fontWeight: 'bold',
                    fontFamily: 'Gotham-Bold',
                }}
                >Join Session</ThemedText>
                </TouchableOpacity>
            </ThemedView>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        gap:10,
    },
    button: {
        backgroundColor: Colors.harmony.primary,
        borderRadius: 16,
        width: 93,
        height: 37,
        alignItems: 'center',
        justifyContent: 'center',
    }
})
