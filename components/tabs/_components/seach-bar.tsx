import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

const SearchBar = ({ value, onChangeText }: SearchBarProps) => {
  const bgColor = useThemeColor({ light: '#000000', dark: '#FFFFFF' }, 'icon');
  return (
    <ThemedView
    darkColor="#23262780"
    lightColor="#FFFFFF80"
     style={styles.container}>
      <Feather name="search" size={24} color={bgColor} />
      <TextInput
        placeholder="Search"
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 12,
    height: 65,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginVertical: 10,
  },
  input: {
    fontSize: 16,
  },
});

export default SearchBar;
