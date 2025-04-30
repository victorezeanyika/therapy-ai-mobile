import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Alert, Text, TouchableOpacity } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { MoodEntry } from '@/features/mood-api';
import { Colors } from '@/constants/Colors';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';

interface MoodFormProps {
  onSubmit: (mood: string, rating: number, note: string, tags: string[], triggers: string[]) => void;
  initialData?: MoodEntry;
  selectedMood?: string;
}

const MoodForm: React.FC<MoodFormProps> = ({ onSubmit, initialData, selectedMood }) => {
  const [rating, setRating] = useState(initialData?.rating || 3);
  const [note, setNote] = useState(initialData?.note || '');
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [triggers, setTriggers] = useState<string[]>(initialData?.triggers || []);
  const [tagInput, setTagInput] = useState('');
  const [triggerInput, setTriggerInput] = useState('');

  const bgColor = useThemeColor({ light: '#FFFFFF', dark: '#23262780' }, 'background');
  const borderColor = useThemeColor({ light: '#FFF3FF', dark: '#23262780' }, 'background');
  const textColor = useThemeColor({ light: '#000000', dark: '#FFFFFF' }, 'text');

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

  const handleSubmit = () => {
    if (!selectedMood) {
      Alert.alert("Please select a mood from the mood wheel first");
      return;
    }
    onSubmit(selectedMood, rating, note, tags, triggers);
  };

  return (
    <View style={styles.container}>
      <ThemedView
       style={styles.selectedMoodContainer}>
        <Text style={[styles.selectedMoodLabel, { color: textColor }]}>Selected Mood:</Text>
        <Text style={[styles.selectedMoodText, { color: textColor }]}>{selectedMood || 'None selected'}</Text>
      </ThemedView>
      <ThemedText style={styles.label}>Rating</ThemedText>
      <TextInput
        style={[styles.input]}
        placeholder="Rating (1-5)"
        value={rating.toString()}
        onChangeText={(text) => setRating(Number(text))}
        keyboardType="numeric"
        placeholderTextColor={textColor}
      />
      <ThemedText style={styles.label}>Note</ThemedText>

      <TextInput
        style={[styles.input]}
        placeholder="Note"
        value={note}
        onChangeText={setNote}
        multiline
        placeholderTextColor={textColor}
      />
      <ThemedText style={styles.label}>Tag</ThemedText>

      <View style={styles.tagsContainer}>
        <TextInput
          style={[styles.input]}
          placeholder="Add tag"
          value={tagInput}
          onChangeText={setTagInput}
          onSubmitEditing={handleAddTag}
          placeholderTextColor={textColor}
        />
        <View style={styles.tagsList}>
          {tags.map((tag, index) => (
            <TouchableOpacity
              key={index}
              style={styles.tag}
              onPress={() => handleRemoveTag(tag)}
            >
              <Text style={styles.tagText}>{tag} ×</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <ThemedText style={styles.label}>Trigger</ThemedText>

      <View style={styles.tagsContainer}>
        
        <TextInput
          style={[styles.input]}
          placeholder="Add trigger"
          value={triggerInput}
          onChangeText={setTriggerInput}
          onSubmitEditing={handleAddTrigger}
          placeholderTextColor={textColor}
        />
        <View style={styles.tagsList}>
          {triggers.map((trigger, index) => (
            <TouchableOpacity
              key={index}
              style={styles.trigger}
              onPress={() => handleRemoveTrigger(trigger)}
            >
              <Text style={styles.triggerText}>{trigger} ×</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>
          {initialData ? 'Update Entry' : 'Add Entry'}
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
    // backgroundColor: 'rgba(0, 255, 200, 0.1)',
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
    // marginTop: 8,
    // borderRadius: 12,
    borderBottomWidth: 1,
    borderColor: Colors.harmony.primary,
    fontSize: 16,
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
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MoodForm; 