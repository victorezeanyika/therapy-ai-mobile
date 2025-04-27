import { Colors } from '@/constants/Colors';
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface AddEntryButtonProps {
  onPress: () => void;
}

const AddEntryButton = ({ onPress }: AddEntryButtonProps) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>+ Add Entry</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.harmony.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    width: 128,
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddEntryButton;
