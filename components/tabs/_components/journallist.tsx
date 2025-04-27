import React from 'react';
import { FlatList, View } from 'react-native';
import JournalEntryCard from './journalentry';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

interface JournalListProps {
  journals: { title: string; date: string; content: string }[];
}

const JournalList = ({ journals }: JournalListProps) => {
  return (
    <ThemedView style={{flex:1 , marginTop: 30}}>
      <View>
        <ThemedText
        type='defaultSemiBold'
        >Previous Entries</ThemedText>
    <FlatList
      data={journals}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ item }) => (
        <JournalEntryCard title={item.title} date={item.date} content={item.content} />
      )}
      />
      </View>

    </ThemedView>
  );
};

export default JournalList;
