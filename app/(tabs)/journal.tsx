import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Alert, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import SearchBar from '../../components/tabs/_components/seach-bar';
import JournalTextArea from '../../components/tabs/_components/journal-text';
import AddEntryButton from '../../components/tabs/_components/add-entrybtn';
import { ThemedView } from '@/components/ThemedView';
import TopHeader from '@/components/TopHeader';
import { useAddJournalEntryMutation, useGetJournalEntriesQuery } from '@/features/journal-api';
import { useToast } from '@/context/toast-context';
import JournalList from '@/components/tabs/_components/journallist';

const JournalScreen = () => {
  const [search, setSearch] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string[]>([]);  // Now tags is an array
  const [tagInput, setTagInput] = useState(''); // Temporary input for new tags
  const [content, setContent] = useState('');
  const [addJournal, { isLoading }] = useAddJournalEntryMutation();
  const { data: journals = [] } = useGetJournalEntriesQuery();
  const { success, error: toastError } = useToast();

  const handleAddEntry = async () => {
    if (!title || !content || tags.length === 0) {
      Alert.alert("Title, content, and at least one tag are required.");
      return;
    }

    try {
      await addJournal({
        title,
        content,
        tags,
      }).unwrap();

      setTitle('');
      setTags([]);
      setTagInput('');
      setContent('');
      success('Journal entry added successfully');
    } catch (error) {
      toastError('Failed to add journal entry.');
      console.log(error);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() !== '' && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput(''); // Clear input after adding tag
    }
  };

  const handleTagRemove = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const filteredJournals = journals.filter((entry) =>
    entry.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ThemedView style={styles.container}>
      <TopHeader title="Journal" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.inner}>
          <SearchBar value={search} onChangeText={setSearch} />

          <TextInput
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />

          <View style={styles.tagsContainer}>
            <TextInput
              placeholder="Add tags (press enter to add)"
              value={tagInput}
              onChangeText={setTagInput}
              onSubmitEditing={handleAddTag} // Add tag when user presses "Enter"
              style={styles.input}
            />
            {tags.length > 0 && (
              <View style={styles.tagsDisplay}>
                {tags.map((tag, index) => (
                  <TouchableOpacity key={index} onPress={() => handleTagRemove(tag)} style={styles.tag}>
                    <Text style={styles.tagText}>{tag} ×</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <Text style={styles.exampleTags}>e.g., travel, fitness, coding</Text>

          <JournalTextArea value={content} onChangeText={setContent} />
          <AddEntryButton onPress={handleAddEntry} loading={isLoading} />

          {/* Using the existing JournalList component for the journal list */}
          <JournalList journals={filteredJournals} />
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
  },
  inner: {
    flex: 1,
    padding: 30,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  input: {
    height: 50,
    paddingHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: '#f1f1f1',
    fontSize: 16,
  },
  tagsContainer: {
    marginVertical: 8,
  },
  tagsDisplay: {
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
  },
  exampleTags: {
    marginTop: 10,
    color: '#777',
    fontStyle: 'italic',
  },
});

export default JournalScreen;
