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
}

const JournalEntryCard = ({ title, date, content }: JournalEntryCardProps) => {
  const iconColor = useThemeColor({light:'#000000', dark:'#FFFFFF'}, 'icon');
  return (
    <ThemedView 
    darkColor='#232627'
    lightColor='#FFFFFF'
    style={styles.card}>
      <View style={{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
      }}>
      <View>
      <ThemedText style={styles.title}>{title}</ThemedText>
      <ThemedText style={styles.date}>{date}</ThemedText>
      </View>
      <View style={{
        flexDirection:'row',
        gap:10,
      }}>
        {/* edit and delete button */}
        <TouchableOpacity>
          <Feather name='trash' size={12} color={iconColor} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Feather name='edit' size={12} color={iconColor} />
        </TouchableOpacity>

      </View>

      </View>

      <ThemedText numberOfLines={3} style={styles.content}>{content}</ThemedText>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    height: 163,
    marginVertical: 8,
    borderRadius: 15,
    borderRightColor:Colors.harmony.primary,
    borderRightWidth:4,
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
});

export default JournalEntryCard;
