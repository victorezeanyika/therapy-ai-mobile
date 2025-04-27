import { ThemedView } from '@/components/ThemedView';
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

interface JournalTextAreaProps {
  value: string;
  onChangeText: (text: string) => void;
}

const JournalTextArea = ({ value, onChangeText }: JournalTextAreaProps) => {
  return (
    <ThemedView 
    darkColor='#232627'
    lightColor='#FFFFFF'
    style={styles.container}>
      <TextInput
        placeholder="Write about your thought and feelings……"
        value={value}
        onChangeText={onChangeText}
        style={styles.textArea}
        multiline
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  textArea: {
    height: 150,
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    textAlignVertical: 'top',
  },
});

export default JournalTextArea;
