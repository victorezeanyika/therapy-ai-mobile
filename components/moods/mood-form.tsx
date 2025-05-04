import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Alert, Text, TouchableOpacity } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { MoodEntry } from '@/features/mood-api';
import { Colors } from '@/constants/Colors';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import { MOODS } from './mood-wheel';

interface MoodFormProps {
  onSubmit: (mood: string, rating: number, note: string, tags: string[], triggers: string[]) => void;
  initialData?: MoodEntry;
  selectedMood?: string;
}

const MoodForm: React.FC<MoodFormProps> = ({ onSubmit, initialData, selectedMood }) => {
  const [note, setNote] = useState(initialData?.note || '');
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [triggers, setTriggers] = useState<string[]>(initialData?.triggers || []);
  const [tagInput, setTagInput] = useState('');
  const [triggerInput, setTriggerInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const textColor = useThemeColor({ light: '#000000', dark: '#FFFFFF' }, 'text');

  const getMoodDisplayLabel = (moodStr: string) => {
    const [mainMoodLabel, subMoodsStr] = moodStr.split('|');
    const mood = MOODS.find(m => m.label === mainMoodLabel);
    const subMoods = subMoodsStr ? subMoodsStr.split(',') : [];
    
    if (!mood) return moodStr;
    
    return subMoods.length > 0
      ? `${mood.displayLabel} (${subMoods.join(', ')})`
      : mood.displayLabel;
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleAddTrigger = () => {
    if (triggerInput.trim() && !triggers.includes(triggerInput.trim())) {
      setTriggers([...triggers, triggerInput.trim()]);
      setTriggerInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleRemoveTrigger = (triggerToRemove: string) => {
    setTriggers(triggers.filter(trigger => trigger !== triggerToRemove));
  };

  const handleSubmit = async () => {
    if (!selectedMood) {
      Alert.alert("Please select a mood from the mood wheel first");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(selectedMood, 0, note, tags, triggers);
    } catch (error) {
      console.error('Error submitting mood:', error);
      Alert.alert('Failed to save mood entry');
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ThemedView style={styles.selectedMoodContainer}>
        <Text style={[styles.selectedMoodLabel, { color: textColor }]}>Selected Mood:</Text>
        <Text style={[styles.selectedMoodText, { color: textColor }]}>
          {selectedMood ? getMoodDisplayLabel(selectedMood) : 'None selected'}
        </Text>
      </ThemedView>

      <ThemedText style={styles.label}>Note (Optional)</ThemedText>
      <TextInput
        style={[styles.input, { color: textColor }]}
        placeholder="Add additional notes here"
        value={note}
        onChangeText={setNote}
        multiline
        placeholderTextColor="#666"
        editable={!isSubmitting}
      />

      <View style={styles.tagsContainer}>
        <View style={styles.tagsList}>
          {triggers.map((trigger, index) => (
            <TouchableOpacity
              key={index}
              style={styles.trigger}
              onPress={() => handleRemoveTrigger(trigger)}
              disabled={isSubmitting}
            >
              <Text style={styles.triggerText}>{trigger} ×</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]} 
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        <Text style={styles.submitButtonText}>
          {isSubmitting ? 'Submitting...' : (initialData ? 'Update Entry' : 'Add Entry')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginTop: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    color: Colors.harmony.primary,
  },
  selectedMoodContainer: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
  },
  selectedMoodLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  selectedMoodText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    height: 50,
    borderBottomWidth: 1,
    borderColor: Colors.harmony.primary,
    fontSize: 16,
    backgroundColor: 'transparent',
  },
  tagsContainer: {
    marginVertical: 8,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    backgroundColor: '#d1d1d1',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#333',
    fontSize: 14,
  },
  trigger: {
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  triggerText: {
    color: Colors.harmony.primary,
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: Colors.harmony.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MoodForm;