import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

interface JournalTextAreaProps {
  value: string;
  onChangeText: (text: string) => void;
}

const JournalTextArea = ({ value, onChangeText }: JournalTextAreaProps) => {
  const inputText = useThemeColor({ light: '#000000', dark: '#FFFFFF' }, 'text');

  return (
    <ThemedView 
    darkColor='#232627'
    lightColor='#FFFFFF'
    style={styles.container}>
      <TextInput
        placeholder="Write about your thought and feelings……"
        value={value}
        onChangeText={onChangeText}
        style={[styles.textArea, { color: inputText }]}
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
