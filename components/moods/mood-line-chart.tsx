import { LineChart } from "react-native-chart-kit";
import { Dimensions, StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useState } from "react";
import { useGetDashboardQuery, DashboardData } from "@/features/journal-api";
import { ThemedView } from "../ThemedView";
import { Colors } from "@/constants/Colors";
import { summaryText } from "@/constants";
import MoodSummary from "./mood-summary";

interface MoodEntry {
  rating: number;
  note: string;
  tags: string[];
  triggers: string[];
  createdAt: string;
  aiAnalysis?: {
    aiAnalysis: any;
    createdAt: string;
    entryId: string;
    note: string;
    rating: number;
    tags: string[];
    triggers: string[];
  };
}

const moodLabels = {
  5: "Surprise",
  4: "Happy",
  3: "Neutral",
  2: "Sad",
  1: "Fear",
  0: "Disgust"
} as const;

const MoodLineChart = ({ analysis }: { analysis: any }) => {
  const cardBg = useThemeColor({ light: '#FFFFFF', dark: '#232627' }, 'background');
  const labelColor = useThemeColor({ dark: '#FFFFFF', light: '#232627' }, 'text');
  const [selectedPoint, setSelectedPoint] = useState<null | {
    rating: number;
    note: string;
    time: string;
    mood: string;
  }>(null);
  const [showLast30Days, setShowLast30Days] = useState(true);

  const { data: dashboardData, isLoading, error } = useGetDashboardQuery();
  const moodEntries = dashboardData?.moodData?.moods || [];

  // Get the appropriate summary text based on the selected time period
  const getSummaryText = () => {
    if (showLast30Days) {
      return analysis?.monthly || "No monthly summary available";
    } else {
      return analysis?.weekly || "No weekly summary available";
    }
  };

  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={cardBg} />
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={[styles.errorText, { color: labelColor }]}>Failed to load mood data</Text>
      </View>
    );
  }

  const sortedMoodEntries = [...moodEntries].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  const filteredData = sortedMoodEntries.filter((mood) => {
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - (showLast30Days ? 30 : 7));
    return new Date(mood.createdAt) >= daysAgo;
  });
  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  const formatTime = (date: string) => {
    const d = new Date(date);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };
  const chartHeight = 208;
  const yAxisHeight = chartHeight - 40;

  const chartData = {
    labels: filteredData.map((mood) => formatDate(mood.createdAt)),
    datasets: [{
      data: filteredData.map((mood) => mood.rating),
    }],
  };

  if (filteredData.length === 0) {
    return (
      <View>
        <ThemedView style={styles.switchContainer}>
          <TouchableOpacity
            style={[styles.switchButton, !showLast30Days && styles.activeButton]}
            onPress={() => setShowLast30Days(false)}
          >
            <Text style={[styles.switchText, { color: labelColor }]}>Last 7 Days</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.switchButton, showLast30Days && styles.activeButton]}
            onPress={() => setShowLast30Days(true)}
          >
            <Text style={[styles.switchText, { color: labelColor }]}>Last 30 Days</Text>
          </TouchableOpacity>
        </ThemedView>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: labelColor }]}>
            No mood data available for the {showLast30Days ? 'last 30 days' : 'last 7 days'}
          </Text>
        </View>
        <MoodSummary text={getSummaryText()} />
      </View>
    );
  }

  return (
    <View>
      <ThemedView
         style={styles.switchContainer}>
        <TouchableOpacity
          style={[styles.switchButton, !showLast30Days && styles.activeButton]}
          onPress={() => setShowLast30Days(false)}
        >
          <Text style={[styles.switchText, { color: labelColor }]}>Last 7 Days</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.switchButton, showLast30Days && styles.activeButton]}
          onPress={() => setShowLast30Days(true)}
        >
          <Text style={[styles.switchText, { color: labelColor }]}>Last 30 Days</Text>
        </TouchableOpacity>
      </ThemedView>
      {/* Mood Labels Legend */}
      <View style={styles.legendContainer}>
        {Object.entries(moodLabels).map(([value, label]) => (
          <View key={value} style={styles.legendItem}>
            <Text style={[styles.legendText, { color: labelColor }]}>{label} ({value})</Text>
          </View>
        ))}
      </View>

      {/* Custom Y-axis labels */}
     

      {/* Line chart */}
      <LineChart
        data={chartData}
        width={Dimensions.get('window').width -50}
        height={chartHeight}
        chartConfig={{
          backgroundColor: cardBg,
          backgroundGradientFrom: cardBg,
          backgroundGradientTo: cardBg,
          color: (opacity = 1) => `rgba(0, 230, 118, ${opacity})`,
          labelColor: () => labelColor,
          propsForDots: { r: '4', strokeWidth: '2', stroke: '#fff' },
          decimalPlaces: 0,
        }}
        bezier
        style={{ borderRadius: 16, }}
        // withInnerLines={false}
        onDataPointClick={({ value, index }) => {
          const mood = filteredData[index];
          setSelectedPoint({
            rating: value,
            note: mood.note,
            time: formatTime(mood.createdAt),
            mood: moodLabels[value as keyof typeof moodLabels],
          });
        }}
      />

      {/* Tooltip */}
      {selectedPoint && (
        <ThemedView style={styles.tooltip}>
          <Text style={[styles.tooltipText, { color: labelColor }]}>
            {selectedPoint.time} - {selectedPoint.mood} ({selectedPoint.rating})
          </Text>
          <Text style={[styles.tooltipText, { color: labelColor }]}>
            Note: {selectedPoint.note}
          </Text>
        </ThemedView>
      )}

      {/* Show summary text */}
      <MoodSummary text={getSummaryText()} />

      {/* Toggle Last 7 / 30 Days */}
    
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    height: 208,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    height: 208,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  tooltip: {
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
    backgroundColor: '#0000001A',
    borderWidth: 1,
    borderLeftColor: Colors.harmony.primary,
    borderLeftWidth: 4,
    borderColor:Colors.harmony.light
  },
  tooltipText: {
    fontSize: 12,
    marginBottom: 4,
  },
  switchContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    marginVertical: 16,
    borderRadius: 16,
    // borderWidth: 1,
    height: 32,
    width: '100%',
    backgroundColor: '#0000001A'
  },
  
  switchButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    width: '49%',

  },
  activeButton: {
    backgroundColor: 'rgba(0, 230, 118, 0.2)',
  },
  switchText: {
    fontSize: 14,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
  },
});

export default MoodLineChart;
