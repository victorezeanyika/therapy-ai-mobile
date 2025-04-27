import { TouchableOpacity,Text,StyleSheet,View } from "react-native";

const MoodTabSwitcher = ({ selected, onSelect }: { selected: string, onSelect: (tab: string) => void }) => (
    <View style={styles.tabSwitcher}>
      <TouchableOpacity
        style={[styles.tab, selected === '7' && styles.tabActive]}
        onPress={() => onSelect('7')}
      >
        <Text style={[styles.tabText, selected === '7' && styles.tabTextActive]}>Last 7 Days</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, selected === '30' && styles.tabActive]}
        onPress={() => onSelect('30')}
      >
        <Text style={[styles.tabText, selected === '30' && styles.tabTextActive]}>Last 30 Days</Text>
      </TouchableOpacity>
    </View>
  );

export default MoodTabSwitcher;

const styles = StyleSheet.create({
    tabSwitcher: {
        flexDirection: 'row',
        marginVertical: 16,
        backgroundColor: '#23242A',
        borderRadius: 12,
        overflow: 'hidden',
      },
      tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
      },
      tabActive: {
        backgroundColor: '#fff',
      },
      tabText: {
        color: '#fff',
        fontWeight: '500',
      },
      tabTextActive: {
        color: '#181A20',
      },
});
