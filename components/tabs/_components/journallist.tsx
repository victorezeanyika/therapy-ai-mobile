import React from 'react';
import { View, StyleSheet } from 'react-native';
import JournalEntry from './journalentry';
import { JournalEntry as JournalEntryType } from '@/features/journal-api';
import { ThemedText } from '@/components/ThemedText';

interface JournalListProps {
  journals: JournalEntryType[];
  onEdit: (entry: JournalEntryType) => void;
}

export default function JournalList({ journals, onEdit }: JournalListProps) {
  // console.log(journals, 'this are');
  return (
    <View style={styles.container}>
      <View>
        <ThemedText type="defaultSemiBold">Previous Entries</ThemedText>
      </View>
      {journals.map((journal) => (
        <JournalEntry
          key={journal.entryId}
          entryId={journal.entryId}
          title={journal.title}
          content={journal.content}
          date={journal.createdAt || new Date().toISOString()}
          tags={journal.tags || []}
          onEdit={onEdit}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    gap: 10,
  },
});
