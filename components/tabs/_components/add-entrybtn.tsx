import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';

interface AddEntryButtonProps {
  onPress: () => void;
  loading: boolean;
  title?: string;
}

export default function AddEntryButton({ onPress, loading, title = 'Add Entry' }: AddEntryButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, loading && { opacity: 0.5 }]}
      onPress={onPress}
      disabled={loading}
    >
      <ThemedText style={styles.buttonText}>
        {loading ? 'Saving...' : title}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.harmony.primary,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
