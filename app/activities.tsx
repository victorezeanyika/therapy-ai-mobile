import React, { useState, useLayoutEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { useGetActivitiesQuery } from '@/features/activities-api';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Feather } from '@expo/vector-icons';
import TopHeader from '@/components/TopHeader';
import { useNavigation } from '@react-navigation/native';

interface Activity {
  _id: string;
  title: string;
  description: string;
  type: string;
  duration: number;
  difficultyLevel: string;
  tags: string[];
  instructions?: string[];
}

const getActivityIcon = (type: string) => {
  const iconMap: Record<string, string> = {
    meditation: '🧘‍♂️',
    cbt: '🧠',
    breathing: '🫁',
    journaling: '📝',
    exercise: '🏃‍♂️',
  };
  return iconMap[type] || '✨';
};

export default function ActivitiesScreen() {
  const navigation = useNavigation();
  const { data: activities, isLoading, error } = useGetActivitiesQuery();
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const cardBg = useThemeColor({ light: '#FFFFFF', dark: '#232627' }, 'bgCard');
  
  // Hide the native navigation header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    });
  }, [navigation]);

  const getActivityKey = (activity: Activity, index: number) => {
    return activity._id || `temp-activity-${index}`;
  };

  if (isLoading) {
    return (
      <ThemedView style={{ flex: 1, height: '100%', marginTop: 20 }}>
        <TopHeader title='Activities' />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Colors.harmony.primary} />
        </View>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={{ flex: 1, height: '100%', marginTop: 20 }}>
        <TopHeader title='Activities' />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
          <ThemedText style={{ textAlign: 'center', marginBottom: 16 }}>
            Failed to load activities. Please try again later.
          </ThemedText>
          <TouchableOpacity
            onPress={() => window.location.reload()}
            style={{
              backgroundColor: Colors.harmony.primary,
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 20,
            }}
          >
            <Text style={{ color: '#FFFFFF' }}>Refresh</Text>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={{ flex: 1, height: '100%', marginTop: 20 }}>
      <TopHeader title='Activities' />
      <ScrollView showsVerticalScrollIndicator={false} style={{ paddingHorizontal: 16 }}>
        <View style={{ gap: 16, paddingVertical: 16 }}>
          {activities?.map((activity, index) => (
            <TouchableOpacity
              key={getActivityKey(activity, index)}
              onPress={() => setSelectedActivity(activity)}
              style={{
                backgroundColor: cardBg,
                borderRadius: 16,
                padding: 16,
                borderRightWidth: 4,
                borderRightColor: Colors.harmony.primary,
              }}
            >
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <Text style={{ fontSize: 24 }}>{getActivityIcon(activity.type)}</Text>
                <View style={{ flex: 1 }}>
                  <ThemedText style={{ fontSize: 18, fontFamily: 'GothamMedium', marginBottom: 8, color: Colors.harmony.primary }}>
                    {activity.title}
                  </ThemedText>
                  <ThemedText style={{ fontSize: 14, marginBottom: 12, opacity: 0.7 }}>
                    {activity.description}
                  </ThemedText>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                    {activity.tags.slice(0, 4).map((tag, idx) => (
                      <View
                        key={`${getActivityKey(activity, index)}-tag-${idx}-${tag}`}
                        style={{
                          backgroundColor: Colors.harmony.bg,
                          paddingHorizontal: 12,
                          paddingVertical: 4,
                          borderRadius: 16,
                        }}
                      >
                        <Text style={{ fontSize: 12, color: Colors.harmony.secondary }}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                  <ThemedText style={{ fontSize: 12, opacity: 0.7 }}>
                    {activity.duration} minutes • {activity.difficultyLevel}
                  </ThemedText>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={!!selectedActivity}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedActivity(null)}
      >
        {selectedActivity && (
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
            <ThemedView
              style={{
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                padding: 20,
                maxHeight: '80%',
              }}
            >
              <View style={{ alignItems: 'flex-end', marginBottom: 16 }}>
                <TouchableOpacity onPress={() => setSelectedActivity(null)}>
                  <Feather name="x" size={24} color={Colors.harmony.primary} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 }}>
                  <Text style={{ fontSize: 24 }}>{getActivityIcon(selectedActivity.type)}</Text>
                  <ThemedText style={{ fontSize: 24, fontFamily: 'GothamBold', color: Colors.harmony.primary }}>
                    {selectedActivity.title}
                  </ThemedText>
                </View>

                <ThemedText style={{ fontSize: 16, marginBottom: 16, opacity: 0.7 }}>
                  {selectedActivity.description}
                </ThemedText>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                  {selectedActivity.tags.map((tag, idx) => (
                    <View
                      key={`modal-${selectedActivity._id || 'temp'}-tag-${idx}-${tag}`}
                      style={{
                        backgroundColor: Colors.harmony.bg,
                        paddingHorizontal: 12,
                        paddingVertical: 4,
                        borderRadius: 16,
                      }}
                    >
                      <Text style={{ fontSize: 12, color: Colors.harmony.secondary }}>{tag}</Text>
                    </View>
                  ))}
                </View>

                <ThemedText style={{ fontSize: 14, marginBottom: 8, opacity: 0.7 }}>
                  Duration: {selectedActivity.duration} minutes
                </ThemedText>
                <ThemedText style={{ fontSize: 14, marginBottom: 16, opacity: 0.7 }}>
                  Difficulty: {selectedActivity.difficultyLevel}
                </ThemedText>

                <View style={{ height: 1, backgroundColor: Colors.harmony.bg, marginVertical: 16 }} />

                <ThemedText style={{ fontSize: 18, fontFamily: 'GothamBold', marginBottom: 12, color: Colors.harmony.primary }}>
                  Instructions
                </ThemedText>
                {selectedActivity.instructions?.map((instruction, idx) => (
                  <View key={`instruction-${selectedActivity._id || 'temp'}-${idx}`} style={{ flexDirection: 'row', marginBottom: 8, gap: 8 }}>
                    <ThemedText style={{ opacity: 0.7 }}>{idx + 1}.</ThemedText>
                    <ThemedText style={{ flex: 1, opacity: 0.7 }}>{instruction}</ThemedText>
                  </View>
                )) || (
                  <ThemedText style={{ opacity: 0.7 }}>No instructions available.</ThemedText>
                )}
              </ScrollView>
            </ThemedView>
          </View>
        )}
      </Modal>
    </ThemedView>
  );
}