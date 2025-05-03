import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView, Modal, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import MoodSelector from '@/components/moods/mood-selector';
import MoodSummary from '@/components/moods/mood-summary';
import MoodLineChart from '@/components/moods/mood-line-chart';
import MoodTabSwitcher from '@/components/moods/mood-switcher';
import TopHeader from '@/components/TopHeader';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import MoodWheel from '@/components/moods/mood-wheel';
import { chartData, moodOptions, summaryText } from '@/constants';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAddMoodEntryMutation, useGetMoodEntriesQuery, useUpdateMoodEntryMutation } from '@/features/mood-api';
import { useToast } from '@/context/toast-context';
import { MoodEntry } from '@/features/mood-api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';
import MoodList from '@/components/moods/mood-list';
import MoodForm from '@/components/moods/mood-form';
import { Colors } from '@/constants/Colors';

export default function MoodJournalScreen({ navigation }: { navigation: NativeStackNavigationProp<RootStackParamList> }) {
  const [tab, setTab] = useState('7');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [editingEntry, setEditingEntry] = useState<MoodEntry | null>(null);
  const [addMood, { isLoading: isAdding }] = useAddMoodEntryMutation();
  const [updateMood, { isLoading: isUpdating }] = useUpdateMoodEntryMutation();
  const { data, refetch, isLoading } = useGetMoodEntriesQuery();
  const { success, error: toastError } = useToast();
  const analysis = data?.analysis || [];
  // console.log(analysis, 'any analysis');
  const moods = data?.moods as any || [];

  const handleAddMood = async (mood: string, rating: number, note: string, tags: string[], triggers: string[]) => {
    try {
      if (editingEntry) {
        await updateMood({
          entryId: editingEntry.entryId!,
          entry: {
            mood,
            rating,
            note,
            tags,
            triggers
          }
        }).unwrap();
        await refetch();
        success('Mood entry updated successfully');
      } else {
        await addMood({
          mood,
          rating,
          note,
          tags,
          triggers
        }).unwrap();
        await refetch();
        success('Mood entry added successfully');
      }

      setIsModalVisible(false);
      setEditingEntry(null);
      setSelectedMood(null);
    } catch (error) {
      toastError('Failed to save mood entry');
      console.error(error);
    }
  };

  const handleEdit = (entry: MoodEntry) => {
    setEditingEntry(entry);
    setSelectedMood(entry.mood);
    setIsModalVisible(true);
  };

  const handleAddNew = () => {
    if (!selectedMood) {
      Alert.alert("Please select a mood from the mood wheel first");
      return;
    }
    setEditingEntry(null);
    setIsModalVisible(true);
  };

  const handleMoodSelect = (mood: string) => {
    console.log('Selected mood:', mood); // Debug log
    setSelectedMood(mood);
  };

  const moodOptions = [
    { label: "Sad", color: "#A3C4F3", submoods: ["Bored", "Lonely", "Despair", "Guilty"] },
    { label: "Fear", color: "#B4AEE8", submoods: ["Insecure", "Rejected", "Anxious", "Scared"] },
    { label: "Anger", color: "#F7A072", submoods: ["Mad", "Hurt", "Threatened", "Distant"] },
    { label: "Surprise", color: "#FFE156", submoods: ["Confused", "Startled", "Amazed", "Excited"] },
    { label: "Happy", color: "#A8E6CF", submoods: ["Joyful", "Proud", "Optimistic", "Peaceful"] },
    { label: "Disgust", color: "#B8E994", submoods: ["Disappointed", "Awful", "Disapproval", "Avoidance"] }
  ];

  return (
    <ThemedView style={styles.container}>
      <TopHeader title="Mood Journal" />
      <ScrollView 
      style={styles.scrollView} 
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      >
      <MoodLineChart
       analysis={analysis}
      />
        <ThemedText style={styles.sectionTitle}>How are you feeling today?</ThemedText>
        <MoodSelector moods={moodOptions} onSelect={handleMoodSelect} />
        <MoodWheel onSelect={handleMoodSelect} />  

        <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
          <Ionicons name="add-circle" size={24} color={Colors.harmony.primary} />
          <ThemedText style={styles.addButtonText}>Add New Mood Entry</ThemedText>
        </TouchableOpacity>
        <MoodList moods={moods} onEdit={handleEdit} />
      </ScrollView>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
            <MoodForm
              onSubmit={handleAddMood}
              initialData={editingEntry || undefined}
              selectedMood={selectedMood || undefined}
            />
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginVertical: 8,
    backgroundColor: 'rgba(65, 186, 190, 0.1)',
    borderRadius: 12,
  },
  addButtonText: {
    marginLeft: 8,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 16,
    maxHeight: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    marginBottom:10,
    zIndex: 1,
  },
});