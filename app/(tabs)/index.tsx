import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import * as Progress from 'react-native-progress';
import Header from '../../components/tabs/_components/header';
import Upgrade from '../../components/tabs/_components/upgrade';
import { ThemedView } from '@/components/ThemedView';
import MoodLineChart from '@/components/moods/mood-line-chart';
import { chartData } from '@/constants';
import { useAppSelector } from '@/features/hooks';
import { ThemedText } from '@/components/ThemedText';
import { useGetDashboardQuery } from '@/features/journal-api';
import UpcommingSession from '@/components/upcoming-session';


export default function HomeScreen() {

  const { user } = useAppSelector(state => state.auth);
  console.log(user, 'this is the user');
  const { data: dashboardData } = useGetDashboardQuery();
  console.log(dashboardData, 'this is the dashboard data');
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

  return (
      <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
       <Header  name={user?.name}/>
        {/* Upgrade Card */}
       <Upgrade />

        {/* Mood Chart */}
        <ThemedView style={styles.card}>
          <ThemedText style={styles.cardTitle}>Mood Tracking</ThemedText>
          <View style={styles.moodLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#2a9d8f' }]} />
              <ThemedText style={styles.legendText}>Happy</ThemedText>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#ff0000' }]} />
              <ThemedText style={styles.legendText}>Sad</ThemedText>
            </View>
          </View>
          <MoodLineChart data={chartData} />
          <ThemedText style={styles.cardTitle}>
          Over the past week, your mood has been generally positive, with a slight dip occurring around mid-week. This temporary decline may be linked to increased stress levels reported during that time. Read More
          </ThemedText>
          <UpcommingSession />
        </ThemedView>

        {/* Monthly Goals */}
        <View style={styles.card}>
          <View style={styles.goalHeader}>
            <Text style={styles.cardTitle}>Monthly Goals</Text>
            <TouchableOpacity style={styles.addButton}>
              <Feather name="plus" size={20} color="#2a9d8f" />
            </TouchableOpacity>
          </View>
          
          {goals.map((goal) => (
            <View key={goal.id} style={styles.goalItem}>
              <View style={styles.goalText}>
                <Text style={styles.goalTitle}>{goal.title}</Text>
                <Text style={styles.goalSubtitle}>{goal.subtitle}</Text>
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
            <Text style={styles.progressTitle}>Progress</Text>
            <View style={styles.progressRow}>
              <Text style={styles.progressText}>Mindfulness Sessions Attended</Text>
              <Text style={styles.progressPercent}>60%</Text>
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
        </View>
      </ScrollView>
      </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:20,
    marginTop:20,
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
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 16,
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