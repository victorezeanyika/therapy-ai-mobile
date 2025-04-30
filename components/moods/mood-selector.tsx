import { View, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "../ThemedText";

interface MoodSelectorProps {
  moods: Array<{
    label: string;
    color: string;
    submoods: string[];
  }>;
  onSelect: (mood: string) => void;
}

const MoodSelector = ({ moods, onSelect }: MoodSelectorProps) => (
  <View style={styles.moodSelector}>
    {moods.map((mood, id) => (
      <TouchableOpacity 
        key={id}
        style={{flexDirection:'row', alignItems:'center', gap:10}}
        onPress={() => onSelect(mood.label)}
      >
        <View
          style={[
            styles.moodButton,
            { backgroundColor: mood.color }
          ]}
        />
        <ThemedText type="defaultSemiBold" style={styles.moodButtonText}>
          {mood.label}
        </ThemedText>
      </TouchableOpacity>
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
    // borderRadius: 8,
    width: 20,
    height: 30,
    marginHorizontal: 4,
  },
  moodButtonText: {
    fontWeight: '500',
  },
});

