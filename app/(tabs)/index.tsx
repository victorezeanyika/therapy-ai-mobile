import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import * as Progress from 'react-native-progress';
import Header from '../../components/tabs/_components/header';
import Upgrade from '../../components/tabs/_components/upgrade';
import { ThemedView } from '@/components/ThemedView';
import MoodLineChart from '@/components/moods/mood-line-chart';
import { useAppSelector } from '@/features/hooks';
import { ThemedText } from '@/components/ThemedText';
import { useGetDashboardQuery } from '@/features/journal-api';
import UpcommingSession from '@/components/upcoming-session';
import TherapySessions from '@/components/therapy-sessions';
import { useGetSubscriptionStatusQuery } from '@/features/subscriptions-api';

export default function HomeScreen() {
  const { data: subscriptionStatus } = useGetSubscriptionStatusQuery();
  const { user } = useAppSelector(state => state.auth);
  const { data: dashboardData } = useGetDashboardQuery();
  const weekDays = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
  const goals = [
    {
      id: "goal1",
      title: "Attend at least two mindfulness sessions",
      subtitle: "Improve emotional regulation",
      completed: false
    },
    {
      id: "goal2",
      title: "Read one book on assertiveness",
      subtitle: "Enhance communication skills",
      completed: true
    },
    {
      id: "goal3",
      title: "Practice self-affirmations daily",
      subtitle: "Boost self-esteem",
      completed: false
    }
  ];
  const moodsData = dashboardData?.moodData?.moods as any;
  const analysis = dashboardData?.moodData?.analysis as any;
  console.log(analysis, 'moodsData')
  

  return (
      <ThemedView style={styles.container}>
      <ScrollView
       style={styles.scrollView}
       showsVerticalScrollIndicator={false}
      >
        {/* Header */}
       <Header  name={user?.name}/>
        {/* Upgrade Card */}
        {!subscriptionStatus  && <Upgrade />}

        {/* Mood Chart */}
        <ThemedView style={styles.card}>
          <ThemedText style={styles.cardTitle}>Mood Tracking</ThemedText>
          <MoodLineChart
          analysis={analysis}
          />
          <View style={{ marginVertical: 24 }}>
            <UpcommingSession />
          </View>

          {/* <ThemedText style={styles.cardTitle}>
            {dashboardData?.chatSessions[0]?.summary}
          </ThemedText> */}
          <TherapySessions chatSessions={dashboardData?.chatSessions || []} />
        </ThemedView>

        {/* Monthly Goals */}
        {/* <ThemedView 
        lightColor="#FFFFFF"
        darkColor="#232627"
        style={styles.card}>
          <View style={styles.goalHeader}>
            <ThemedText style={styles.cardTitle}>Monthly Goals</ThemedText>
            <TouchableOpacity style={styles.addButton}>
              <Feather name="plus" size={20} color="#2a9d8f" />
            </TouchableOpacity>
          </View>
          
          {goals.map((goal) => (
            <View key={goal.id} style={styles.goalItem}>
              <View style={styles.goalText}>
                <ThemedText style={styles.goalTitle}>{goal.title}</ThemedText>
                <ThemedText style={styles.goalSubtitle}>{goal.subtitle}</ThemedText>
              </View>
              <TouchableOpacity 
                style={[
                  styles.checkbox,
                  goal.completed && styles.checkboxChecked
                ]}
              >
                {goal.completed && <Feather name="check" size={16} color="white" />}
              </TouchableOpacity>
            </View>
          ))}

          <View style={styles.progressSection}>
            <ThemedText style={styles.progressTitle}>Progress</ThemedText>
            <View style={styles.progressRow}>
              <ThemedText style={styles.progressText}>Mindfulness Sessions Attended</ThemedText>
              <ThemedText style={styles.progressPercent}>60%</ThemedText>
            </View>
            <Progress.Bar 
              progress={0.6} 
              width={null} 
              color="#2a9d8f" 
              unfilledColor="#dbe0e5"
              borderWidth={0}
              height={8}
              style={styles.progressBar}
            />
          </View>
        </ThemedView> */}
      </ScrollView>
      </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal:20,
    marginTop:30,
  },
  scrollView: {
    flex: 1,
  },

  card: {
    borderRadius: 10,
    marginBottom: 20,
    // shadowColor: '#000',
    // shadowOffset: { width: 1, height: 1 },
    // shadowOpacity: 0.1,
    // shadowRadius: 6,
    // elevation: 2,
    width: '100%',
    padding: 14,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  moodLegend: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  dayText: {
    fontSize: 12,
    color: '#666',
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
  },
  goalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  goalText: {
    flex: 1,
    marginRight: 16,
  },
  goalTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  goalSubtitle: {
    fontSize: 12,
    color: '#637787',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#dbe0e5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#2a9d8f',
    borderColor: '#2a9d8f',
  },
  progressSection: {
    marginTop: 24,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 12,
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: '500',
  },
  progressBar: {
    width: '100%',
    borderRadius: 4,
  },
});