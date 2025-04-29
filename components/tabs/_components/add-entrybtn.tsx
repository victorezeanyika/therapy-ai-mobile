import { Colors } from '@/constants/Colors';
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface AddEntryButtonProps {
  onPress: () => void;
  loading: boolean; // Added loading prop
}

const AddEntryButton = ({ onPress, loading }: AddEntryButtonProps) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} disabled={loading}>
      {loading ? (
        <ActivityIndicator size="small" color="#FFF" /> // Displaying spinner when loading is true
      ) : (
        <Text style={styles.buttonText}>+ Add Entry</Text> // Display text when not loading
      )}
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
