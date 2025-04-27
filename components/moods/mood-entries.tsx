import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native";

const PreviousEntries = ({ entries }: { entries: any[] }) => (
    <View style={styles.previousEntries}>
      <Text style={styles.previousTitle}>Previous Entries</Text>
      <View style={styles.entriesRow}>
        {entries.map((entry, idx) => (
          <View key={idx} style={styles.entryIconWrap}>
            <Ionicons name={entry.icon} size={28} color={entry.color} />
            <Text style={styles.entryMood}>{entry.mood}</Text>
          </View>
        ))}
      </View>
    </View>
  );

export default PreviousEntries;

const styles = StyleSheet.create({
    previousEntries: {
        backgroundColor: '#23242A',
        borderRadius: 16,
        padding: 16,
      },
      previousTitle: {
        color: '#fff',
        fontWeight: '600',
        marginBottom: 10,
      },
      entriesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      entryIconWrap: {
        alignItems: 'center',
      },
      entryMood: {
        color: '#fff',
        fontSize: 12,
        marginTop: 4,
      },
});