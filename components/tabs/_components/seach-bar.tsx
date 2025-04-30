import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Feather } from '@expo/vector-icons';
import React, { useRef } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

const SearchBar = ({ value, onChangeText }: SearchBarProps) => {
  const inputRef = useRef<TextInput>(null);
  const inputText = useThemeColor({light:'#000000', dark:'#FFFFFF'}, 'button')
  const bgColor = useThemeColor({ light: '#000000', dark: '#FFFFFF' }, 'icon');
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        // Focus the TextInput when the container is pressed
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }}
    >
      <ThemedView
        darkColor="#23262780"
        lightColor="#FFFFFF80"
        style={styles.container}>
        <Feather name="search" size={24} color={bgColor} />
        <TextInput
          ref={inputRef}
          placeholder="Search"
          value={value}
          onChangeText={onChangeText}
          style={[styles.input, {color:inputText, flex: 1}]}
        />
      </ThemedView>
    </TouchableOpacity>
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