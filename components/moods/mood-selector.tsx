import { View, StyleSheet } from "react-native";
import { ThemedText } from "../ThemedText";

const MoodSelector = ({ moods }: { moods: any[] }) => (
  <View style={styles.moodSelector}>
    {moods.map((mood) => (
      <View style={{flexDirection:'row', alignItems:'center', gap:10}}>
      <View
        key={mood.name}
        style={[
          styles.moodButton,
          { backgroundColor: mood.color }
        ]}
      >
      </View>
        <ThemedText type="defaultSemiBold" style={styles.moodButtonText}>
          {mood.name}
        </ThemedText>
        </View>

    ))}
  </View>
);

export default MoodSelector;

const styles = StyleSheet.create({
  moodSelector: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  moodButton: {
    borderRadius: 8,
    width: 20,
    height: 30,
    marginHorizontal: 4,
  },
  moodButtonText: {
    fontWeight: '500',
  },
});

