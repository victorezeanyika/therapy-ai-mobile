import { ThemedText } from "@/components/ThemedText";
import { MaterialIcons } from "@expo/vector-icons";
import { View, StyleSheet, TouchableOpacity } from "react-native";

export default function Header({name}: {name: string}) {
    // Capitalize each word in the name
    const capitalizedName = name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    return (
        <View style={styles.header}>
            <ThemedText style={styles.greeting}>Hi {capitalizedName},</ThemedText>
            <TouchableOpacity style={styles.notificationButton}>
                <MaterialIcons name="notifications-none" size={24} color="#2a9d8f" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 20, // Added top margin
        paddingHorizontal: 10, // Added horizontal padding
    },
    greeting: {
        fontSize: 18,
        fontWeight: '500',
    },
    notificationButton: {
        padding: 8,
        backgroundColor: '#2a9d8f0d',
        borderRadius: 26,
    },
});