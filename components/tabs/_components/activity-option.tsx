import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ActivityOptionsProps {
  activities: { id: string, name: string }[];
}

export default function ActivityOptions({ activities }: ActivityOptionsProps) {
  return (
    <View style={styles.container}>
      {activities.map(activity => (
        <TouchableOpacity key={activity.id} style={styles.option}>
          <Text style={styles.optionText}>{activity.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 },
  option: { padding: 10, backgroundColor: '#e0f7fa', borderRadius: 8 },
  optionText: { color: '#00796b', fontSize: 14 }
});
