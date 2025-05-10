import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import JournalEntry from './journalentry';
import { JournalEntry as JournalEntryType } from '@/features/journal-api';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';

interface JournalListProps {
  journals: JournalEntryType[];
  onEdit: (entry: JournalEntryType) => void;
  onDelete: (entry: JournalEntryType) => void;
  onCancelEdit?: () => void;
  isEditing?: boolean;
  onEndReached?: () => void;
  isLoading?: boolean;
  hasMore?: boolean;
}

export default function JournalList({ 
  journals, 
  onEdit, 
  onDelete,
  onCancelEdit,
  isEditing = false,
  onEndReached,
  isLoading = false,
  hasMore = false 
}: JournalListProps) {
  const PAGE_SIZE = 2;
  const [currentPage, setCurrentPage] = useState(0);
  
  const totalPages = Math.ceil(journals.length / PAGE_SIZE);
  const displayedJournals = journals.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE
  );



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
      <View style={styles.entriesContainer}>
        {displayedJournals.map((journal) => (
          <JournalEntry
            key={journal.entryId}
            entryId={journal.entryId}
            title={journal.title}
            content={journal.content}
            date={journal.createdAt || journal?.updatedAt}
            tags={journal.tags || []}
            onEdit={() => onEdit(journal)}
            onDelete={() => onDelete(journal)}
          />
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
}

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
  entriesContainer: {
    gap: 16,
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