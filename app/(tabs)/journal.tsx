import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import SearchBar from '../../components/tabs/_components/seach-bar';
import DatePickerButton from '../../components/tabs/_components/date-btn';
import JournalTextArea from '../../components/tabs/_components/journal-text';
import AddEntryButton from '../../components/tabs/_components/add-entrybtn';
import JournalList from '../../components/tabs/_components/journallist';
import { ThemedView } from '@/components/ThemedView';
import TopHeader from '@/components/TopHeader';

// Mock journal data
const mockJournals = [
  { id: '1', title: 'Morning Thoughts', date: '2025-04-25', content: 'Feeling refreshed and motivated today.' },
  { id: '2', title: 'Afternoon Slump', date: '2025-04-25', content: 'Got really tired after lunch. Need better habits.' },
  { id: '3', title: 'Late Night Reflections', date: '2025-04-24', content: 'Thinking about the future and feeling a bit anxious.' },
];

const JournalScreen = () => {
  const [search, setSearch] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(new Date());
  const [journals, setJournals] = useState(mockJournals); // <--- use mock data

  const handleAddEntry = () => {
    const newEntry = {
      id: Date.now().toString(),
      title: 'New Entry',
      date: date.toISOString().split('T')[0],
      content,
    };
    setJournals([newEntry, ...journals]);
    setContent('');
  };

  const filteredJournals = journals.filter((entry) =>
    entry.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ThemedView style={styles.container}>
      <TopHeader title="Journal" />
      <View style={{flex:1, padding:30,}}>
      <SearchBar value={search} onChangeText={setSearch} />
      <JournalTextArea value={content} onChangeText={setContent} />
      <AddEntryButton onPress={handleAddEntry} />
      <JournalList journals={filteredJournals} />
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
  },
});

export default JournalScreen;
