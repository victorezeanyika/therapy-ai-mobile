import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import MoodSelector from '@/components/moods/mood-selector';
import MoodSummary from '@/components/moods/mood-summary';
import MoodLineChart from '@/components/moods/mood-line-chart';
import MoodTabSwitcher from '@/components/moods/mood-switcher';
import TopHeader from '@/components/TopHeader';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import MoodWheel from '@/components/moods/mood-wheel';
import PreviousEntries from '@/components/moods/mood-entries';
import { chartData, moodOptions, summaryText, previousEntries } from '@/constants';



const MOODS = [
  {
    label: "Sad",
    color: "#A3C4F3",
    submoods: ["Bored", "Lonely", "Despair", "Guilty"]
  },
  {
    label: "Fear",
    color: "#B4AEE8",
    submoods: ["Insecure", "Rejected", "Anxious", "Scared"]
  },
  {
    label: "Anger",
    color: "#F7A072",
    submoods: ["Mad", "Hurt", "Threatened", "Distant"]
  },
  {
    label: "Surprise",
    color: "#FFE156",
    submoods: ["Confused", "Startled", "Amazed", "Excited"]
  },
  {
    label: "Happy",
    color: "#A8E6CF",
    submoods: ["Joyful", "Proud", "Optimistic", "Peaceful"]
  },
  {
    label: "Disgust",
    color: "#B8E994",
    submoods: ["Disappointed", "Awful", "Disapproval", "Avoidance"]
  }
];





export default function MoodJournalScreen({ navigation }) {
  const [tab, setTab] = useState('7');
  const [selectedMood, setSelectedMood] = useState(null);

  return (
    <ThemedView 
    style={{ 
      flex: 1 ,
      paddingTop: 20,

    }}
    >
    <TopHeader title="Mood Journal" />
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
        <MoodTabSwitcher selected={tab} onSelect={setTab} />
        <MoodLineChart data={chartData} />
        <MoodSummary text={summaryText} />
        <ThemedText
         style={styles.sectionTitle}>How are you feeling today?</ThemedText>
        <MoodSelector 
         moods={moodOptions}
         />
        <MoodWheel />
        <PreviousEntries
         entries={previousEntries}
          />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    // marginBottom: 62,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 0,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '500',
    marginLeft: 16,
    color: '#fff',
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },


  moodWheel: {
    width: '100%',
    height: 220,
    backgroundColor: '#23242A',
    borderRadius: 110,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
 
});