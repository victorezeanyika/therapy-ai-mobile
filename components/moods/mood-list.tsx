import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Feather } from '@expo/vector-icons';
import { useDeleteMoodEntryMutation, useGetMoodEntriesQuery } from '@/features/mood-api';
import { useToast } from '@/context/toast-context';
import { MoodEntry } from '@/features/mood-api';
import { formatDate } from '@/utils/date-formatter';
import { Colors } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';

interface MoodListProps {
  moods: MoodEntry[];
  onEdit: (entry: MoodEntry) => void;
}

const MoodList: React.FC<MoodListProps> = ({ moods, onEdit }) => {
  const [deleteMood] = useDeleteMoodEntryMutation();
  const { refetch } = useGetMoodEntriesQuery();
  const { success, error: toastError } = useToast();
  const iconColor = '#666';
  const borderColor = useThemeColor({ light: Colors.harmony.primary, dark: '#232627' }, 'tint');

  const handleDelete = (entryId: string) => {
    Alert.alert(
      'Delete Mood Entry',
      'Are you sure you want to delete this entry?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMood(entryId).unwrap();
              await refetch();
              success('Mood entry deleted successfully');
            } catch (error) {
              toastError('Failed to delete mood entry');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.moodList}>
      {moods && moods.map((entry) => (
        <ThemedView
          key={entry.entryId}
          lightColor="#FFFFFF"
          darkColor="#232627"
          style={[styles.moodCard, { borderRightColor: borderColor }]}
        >
          <View style={styles.moodHeader}>
            <ThemedText type="defaultSemiBold" style={styles.moodTitle}>
              {entry.mood}
            </ThemedText>
            <ThemedText style={styles.date}>
              {formatDate(entry.createdAt || new Date().toISOString())}
            </ThemedText>
          </View>
          <ThemedText type="subtitle" style={styles.moodNote}>
            {entry.note}
          </ThemedText>
          <View style={styles.tagsContainer}>
            {entry.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <ThemedText style={styles.tagText}>{tag}</ThemedText>
              </View>
            ))}
          </View>
          <View style={styles.triggersContainer}>
            {entry.triggers.map((trigger, index) => (
              <View key={index} style={styles.trigger}>
                <ThemedText style={styles.triggerText}>{trigger}</ThemedText>
              </View>
            ))}
          </View>
          <View style={styles.iconContainer}>
            <TouchableOpacity 
              style={styles.iconButton} 
              onPress={() => onEdit(entry)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather name="edit" size={20} color={iconColor} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.iconButton} 
              onPress={() => handleDelete(entry.entryId!)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather name="trash" size={20} color={iconColor} />
            </TouchableOpacity>
          </View>
        </ThemedView>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  moodList: {
    marginTop: 20,
  },
  moodCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderRightWidth: 4,
    borderRightColor: Colors.harmony.primary,

  },
  moodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  moodTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  moodNote: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
    gap: 8,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagText: {
    fontSize: 12,
    color: '#666',
  },
  triggersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  trigger: {
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  triggerText: {
    fontSize: 12,
    color: '#1976d2',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 16,
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
});

export default MoodList; 