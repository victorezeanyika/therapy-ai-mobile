import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Feather } from '@expo/vector-icons';
import { useDeleteJournalEntryMutation, useGetJournalEntriesQuery } from '@/features/journal-api';
import { useToast } from '@/context/toast-context';
import { JournalEntry as JournalEntryType } from '@/features/journal-api';
import { formatDate } from '@/utils/date-formatter';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
interface JournalEntryProps {
  title: string;
  content: string;
  date: string;
  entryId: string | undefined;
  tags: string[];
  onEdit: (entry: JournalEntryType) => void;
}

export default function JournalEntry({ title, content, date, entryId, tags, onEdit }: JournalEntryProps) {
  const [deleteJournal] = useDeleteJournalEntryMutation();
  const { refetch } = useGetJournalEntriesQuery();
  const { success, error: toastError } = useToast();
  const iconColor = '#666';

  const handleDelete = () => {
    Alert.alert(
      'Delete Journal Entry',
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
              await deleteJournal(entryId).unwrap();
              await refetch();
              success('Journal entry deleted successfully');
            } catch (error) {
              toastError('Failed to delete journal entry');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleEdit = () => {
    onEdit({ entryId, title, content, tags, createdAt: date });
  };

  return (
    <ThemedView
    lightColor="#FFFFFF"
    darkColor="#232627"
    style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="defaultSemiBold" style={styles.title}>
          {title}
        </ThemedText>
        <ThemedText style={styles.date}>{formatDate(date)}</ThemedText>
      </View>
      <ThemedText type="subtitle" style={styles.content}>{content}</ThemedText>
      <View style={styles.tagsContainer}>
        {tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <ThemedText style={styles.tagText}>{tag}</ThemedText>
          </View>
        ))}
      </View>
      <View style={styles.iconContainer}>
        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={handleEdit}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="edit" size={20} color={iconColor} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={handleDelete}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="trash" size={20} color={iconColor} />
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    // Remove these shadow properties:
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 3.84,
    // elevation: 5,
    borderRightColor: Colors.harmony.primary,
    borderRightWidth: 4,
  },
  header: {
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
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
