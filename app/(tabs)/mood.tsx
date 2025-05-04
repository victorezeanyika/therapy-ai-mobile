import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Modal, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MoodLineChart from '@/components/moods/mood-line-chart';
import TopHeader from '@/components/TopHeader';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import MoodWheel, { MOODS } from '@/components/moods/mood-wheel';
import { useAddMoodEntryMutation, useGetMoodEntriesQuery, useUpdateMoodEntryMutation } from '@/features/mood-api';
import { useToast } from '@/context/toast-context';
import { MoodEntry } from '@/features/mood-api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';
import MoodList from '@/components/moods/mood-list';
import MoodForm from '@/components/moods/mood-form';
import { Colors } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function MoodJournalScreen({ navigation }: { navigation: NativeStackNavigationProp<RootStackParamList> }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [editingEntry, setEditingEntry] = useState<MoodEntry | null>(null);
  const [addMood, { isLoading: isAdding }] = useAddMoodEntryMutation();
  const [updateMood, { isLoading: isUpdating }] = useUpdateMoodEntryMutation();
  const { data, refetch, isLoading } = useGetMoodEntriesQuery();
  const { success, error: toastError } = useToast();
  const analysis = data?.analysis || [];
  const moods = data?.moods || [];
  const iconColor = useThemeColor({ light: '#000000', dark: '#FFFFFF' }, 'icon');
  
  const handleAddMood = async (mood: string, rating: number, note: string, tags: string[], triggers: string[]) => {
    try {
      const [mainMoodLabel, subMoodsStr] = mood.split('|');
      const selectedSubMoods = subMoodsStr ? subMoodsStr.split(',') : [];

      const moodObj = MOODS.find(m => m.label === mainMoodLabel);
  
      if (!moodObj) {
        toastError('Invalid mood selection');
        return;
      }
  
      const moodRatings = {
        'very-sad': 1,
        'sad': 2,
        'neutral': 3,
        'happy': 4,
        'amazing': 5
      };

      const moodRating = moodRatings[mainMoodLabel as keyof typeof moodRatings] || 3;
  
      const noteContent = selectedSubMoods.length > 0
        ? `Feelings: ${selectedSubMoods.join(', ')}${note ? '\n\n' + note : ''}`
        : note || 'No specific feelings noted';
  
      if (editingEntry) {
        await updateMood({
          entryId: editingEntry.entryId!,
          entry: {
            mood: mainMoodLabel,
            rating: moodRating,
            note: noteContent,
            tags,
            triggers
          }
        }).unwrap();
        await refetch();
        success('Mood entry updated successfully');
      } else {
        await addMood({
          mood: mainMoodLabel,
          rating: moodRating,
          note: noteContent,
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
    setSelectedMood(mood);
  };

  return (
    <ThemedView style={styles.container}>
      <TopHeader title="Mood Journal" />
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <MoodLineChart analysis={analysis} />
        <ThemedText style={styles.sectionTitle}>How are you feeling today?</ThemedText>
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
          <ThemedView style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Ionicons name="close" size={24} color={iconColor} />
            </TouchableOpacity>
            <MoodForm
              onSubmit={handleAddMood}
              initialData={editingEntry || undefined}
              selectedMood={selectedMood || undefined}
            />
          </ThemedView>
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
    borderRadius: 30,
    padding: 16,
    maxHeight: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    marginBottom: 10,
    zIndex: 1,
  },
});