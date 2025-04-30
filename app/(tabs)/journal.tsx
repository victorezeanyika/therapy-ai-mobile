import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Alert, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import SearchBar from '../../components/tabs/_components/seach-bar';
import JournalTextArea from '../../components/tabs/_components/journal-text';
import AddEntryButton from '../../components/tabs/_components/add-entrybtn';
import { ThemedView } from '@/components/ThemedView';
import TopHeader from '@/components/TopHeader';
import { useAddJournalEntryMutation, useGetJournalEntriesQuery, useUpdateJournalEntryMutation } from '@/features/journal-api';
import { useToast } from '@/context/toast-context';
import JournalList from '@/components/tabs/_components/journallist';
import { JournalEntry } from '@/features/journal-api';
import { useThemeColor } from '@/hooks/useThemeColor';

const JournalScreen = () => {
  const [search, setSearch] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [content, setContent] = useState('');
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [addJournal, { isLoading: isAdding }] = useAddJournalEntryMutation();
  const [updateJournal, { isLoading: isUpdating }] = useUpdateJournalEntryMutation();
  const { data: journals = [], refetch } = useGetJournalEntriesQuery();
  const { success, error: toastError } = useToast();
  const inputText = useThemeColor({ light: '#000000', dark: '#FFFFFF' }, 'text');
  const bgColor = useThemeColor({ light: '#FFFFFF', dark: '#23262780' }, 'background');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 20,
    },
    inner: {
      flex: 1,
      padding: 30,
      marginBottom: 100,
    },
    keyboardAvoidingView: {
      flex: 1,
    },
    input: {
      height: 50,
      paddingHorizontal: 16,
      marginVertical: 8,
      borderRadius: 12,
      color: inputText,
      backgroundColor: bgColor,
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

  const handleAddEntry = async () => {
    if (!title || !content || tags.length === 0) {
      Alert.alert("Title, content, and at least one tag are required.");
      return;
    }

    try {
      if (editingEntry) {
        await updateJournal({
          entryId: editingEntry.entryId!,
          entry: { title, content, tags }
        }).unwrap();
        await refetch();
        success('Journal entry updated successfully');
      } else {
        await addJournal({
          title,
          content,
          tags,
        }).unwrap();
        await refetch();
        success('Journal entry added successfully');
      }

      setTitle('');
      setTags([]);
      setTagInput('');
      setContent('');
      setEditingEntry(null);
    } catch (error) {
      toastError('Failed to save journal entry.');
      console.log(error);
    }
  };

  const handleEdit = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setTitle(entry.title);
    setContent(entry.content);
    setTags(entry.tags || []);
  };

  const handleCancelEdit = () => {
    setEditingEntry(null);
    setTitle('');
    setContent('');
    setTags([]);
    setTagInput('');
  };

  const handleAddTag = () => {
    if (tagInput.trim() !== '' && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
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
      <ScrollView>
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
                onSubmitEditing={handleAddTag}
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
            <AddEntryButton 
              onPress={handleAddEntry} 
              onCancel={handleCancelEdit}
              loading={isAdding || isUpdating}
              title={editingEntry ? 'Update Entry' : 'Add Entry'}
              isEditing={!!editingEntry}
            />

            <JournalList 
              journals={filteredJournals} 
              onEdit={handleEdit} 
              onCancelEdit={handleCancelEdit}
              isEditing={!!editingEntry}
            />
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </ThemedView>
  );
};

export default JournalScreen;