import { Text,StyleSheet } from "react-native";
import { ThemedText } from "../ThemedText";

const MoodSummary = ({ text }: { text: string }) => (
    <ThemedText type="subtitle" style={styles.summaryText}>{text}</ThemedText>
  );

export default MoodSummary;

const styles = StyleSheet.create({
    summaryText: {
        marginVertical: 12,
        fontSize: 13,
        lineHeight: 18,
      },
});
