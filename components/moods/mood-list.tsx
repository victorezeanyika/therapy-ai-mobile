import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Feather } from '@expo/vector-icons';
import { useDeleteMoodEntryMutation, useGetMoodEntriesQuery } from '@/features/mood-api';
import { useToast } from '@/context/toast-context';
import { MoodEntry } from '@/features/mood-api';
import { formatDate } from '@/utils/date-formatter';
import { Colors } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';
import { MOODS } from '../moods/mood-wheel';

interface MoodListProps {
  moods: MoodEntry[];
  onEdit: (entry: MoodEntry) => void;
  onCancelEdit?: () => void;
  isEditing?: boolean;
  onEndReached?: () => void;
  isLoading?: boolean;
  hasMore?: boolean;
}

const MoodList: React.FC<MoodListProps> = ({ 
  moods, 
  onEdit,
  onCancelEdit,
  isEditing = false,
  onEndReached,
  isLoading = false,
  hasMore = false 
}) => {
  const [deleteMood] = useDeleteMoodEntryMutation();
  const { refetch } = useGetMoodEntriesQuery();
  const { success, error: toastError } = useToast();
  const iconColor = '#666';
  const borderColor = useThemeColor({ light: Colors.harmony.primary, dark: '#232627' }, 'tint');

  const PAGE_SIZE = 2;
  const [currentPage, setCurrentPage] = useState(0);
  
  const totalPages = Math.ceil(moods.length / PAGE_SIZE);
  const displayedMoods = moods.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE
  );

  const getMoodDisplayLabel = (label: string) => {
    const mood = MOODS.find(m => m.label === label);
    return mood ? mood.displayLabel : label;
  };

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
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle} type="defaultSemiBold">Previous Entries</ThemedText>
        {isEditing && onCancelEdit && (
          <TouchableOpacity 
            onPress={onCancelEdit}
            style={styles.cancelButton}
          >
            <ThemedText style={styles.cancelButtonText}>Cancel Edit</ThemedText>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.moodList}>
        {displayedMoods.map((entry) => (
          <ThemedView
            key={entry.entryId}
            lightColor="#FFFFFF"
            darkColor="#232627"
            style={[styles.moodCard, { borderRightColor: borderColor }]}
          >
            <View style={styles.moodHeader}>
              <ThemedText type="defaultSemiBold" style={styles.moodTitle}>
                {getMoodDisplayLabel(entry.mood)}
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
        {hasMore && (
          <View style={styles.loadingContainer}>
            {isLoading && (
              <View style={styles.loadingContent}>
                <ActivityIndicator size="small" color={Colors.harmony.primary} />
                <ThemedText style={styles.loadingText}>Loading more entries...</ThemedText>
              </View>
            )}
          </View>
        )}
      </View>
      {totalPages > 1 && (
        <View style={styles.paginationContainer}>
          <TouchableOpacity 
            onPress={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
            style={[styles.paginationButton, currentPage === 0 && styles.paginationButtonDisabled]}
          >
            <ThemedText style={styles.paginationText}>Previous</ThemedText>
          </TouchableOpacity>
          <ThemedText style={styles.pageInfo}>
            {currentPage + 1} / {totalPages}
          </ThemedText>
          <TouchableOpacity 
            onPress={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
            disabled={currentPage >= totalPages - 1}
            style={[styles.paginationButton, currentPage >= totalPages - 1 && styles.paginationButtonDisabled]}
          >
            <ThemedText style={styles.paginationText}>Next</ThemedText>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    gap: 10,
  },
  header: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    color: Colors.harmony.primary,
  },
  cancelButton: {
    backgroundColor: Colors.harmony.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  moodList: {
    marginTop: 20,
  },
  moodCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderRightWidth: 4,
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
  loadingContainer: {
    height: 16,
  },
  loadingContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    opacity: 0.7,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  paginationButton: {
    backgroundColor: Colors.harmony.primary,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  paginationButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.5,
  },
  paginationText: {
    color: '#fff',
    fontSize: 14,
  },
  pageInfo: {
    fontSize: 14,
  },
});

export default MoodList;