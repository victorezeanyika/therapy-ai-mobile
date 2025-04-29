import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';

interface JournalEntryCardProps {
  title: string;
  date: string;
  content: string;
  tags: string[];
}

const JournalEntryCard = ({ title, date, content, tags }: JournalEntryCardProps) => {
  const iconColor = useThemeColor({ light: '#000000', dark: '#FFFFFF' }, 'icon');
  return (
    <ThemedView darkColor="#232627" lightColor="#FFFFFF" style={styles.card}>
      <View style={styles.header}>
        <View>
          <ThemedText style={styles.title}>{title}</ThemedText>
          <ThemedText style={styles.date}>{date}</ThemedText>
        </View>
        <View style={styles.iconContainer}>
          {/* edit and delete button */}
          <TouchableOpacity>
            <Feather name="trash" size={12} color={iconColor} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Feather name="edit" size={12} color={iconColor} />
          </TouchableOpacity>
        </View>
      </View>

      <ThemedText numberOfLines={3} style={styles.content}>
        {content}
      </ThemedText>

      <ThemedView style={styles.tagsContainer}>
        {tags.map((tag, index) => (
          <ThemedText key={index} style={styles.tag}>
            {tag}
          </ThemedText>
        ))}
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    height: 163,
    marginVertical: 8,
    borderRadius: 15,
    borderRightColor: Colors.harmony.primary,
    borderRightWidth: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 12,
    fontWeight: 'medium',
  },
  date: {
    fontSize: 11,
    color: '#777',
  },
  content: {
    fontSize: 14,
    marginTop: 17,
  },
  iconContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
    flexWrap: 'wrap', // Ensures tags wrap onto the next line if necessary
  },
  tag: {
    backgroundColor: Colors.harmony.secondary, // Adjust as needed
    color: '#fff', // White text color for the tags
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12, // Makes the tags pill-shaped
    fontSize: 10, // Small font size for tags
    overflow: 'hidden',
    textAlign: 'center', // Center-align text within the tag
  },
});

export default JournalEntryCard;
