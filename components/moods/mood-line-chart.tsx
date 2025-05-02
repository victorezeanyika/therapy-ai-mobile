import { LineChart } from "react-native-chart-kit";
import { Dimensions, StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useState } from "react";
import { useGetDashboardQuery, DashboardData } from "@/features/journal-api";

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
const MoodLineChart = () => {
  const cardBg = useThemeColor({ light: '#FFFFFF', dark: '#232627' }, 'background');
  const labelColor = useThemeColor({ dark: '#FFFFFF', light: '#232627' }, 'text');
  const [selectedPoint, setSelectedPoint] = useState<null | {
    rating: number;
    note: string;
    time: string;
    mood: string;
  }>(null);
  const [showLast30Days, setShowLast30Days] = useState(false);

  const { data: dashboardData, isLoading, error } = useGetDashboardQuery();
  const moodEntries = dashboardData?.moodData?.moods || [];

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

  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const formatTime = (date: string) => new Date(date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  const chartHeight = 208;
  const yAxisHeight = chartHeight - 40; // vertical padding of LineChart

  const chartData = {
    labels: filteredData.map((mood) => formatDate(mood.createdAt)),
    datasets: [{
      data: filteredData.map((mood) => mood.rating),
    }],
  };

  // Ensure we have valid data points
  if (filteredData.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={[styles.errorText, { color: labelColor }]}>
          No mood data available for the selected period
        </Text>
      </View>
    );
  }

  return (
    <View style={{ position: 'relative', paddingLeft: 70 }}>
      {/* Custom Y-axis labels */}
      <View style={[styles.yAxisCustomLabels, { height: chartHeight }]}>
        {Object.entries(moodLabels).reverse().map(([value, label], index) => (
          <Text
            key={value}
            style={{
              position: 'absolute',
              top: (yAxisHeight / 5) * index,
              color: labelColor,
              fontSize: 10,
              right: 8,
              textAlign: 'right',
            }}
          >
            {label}
          </Text>
        ))}
      </View>

      {/* Line chart */}
      <LineChart
        data={chartData}
        width={Dimensions.get('window').width - 100}
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
        style={{ borderRadius: 16 }}
        withInnerLines={false}
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
        <View style={styles.tooltip}>
          <Text style={[styles.tooltipText, { color: labelColor }]}>
            {selectedPoint.time} - {selectedPoint.mood}
          </Text>
          <Text style={[styles.tooltipText, { color: labelColor }]}>
            Note: {selectedPoint.note}
          </Text>
        </View>
      )}

      {/* Toggle Last 7 / 30 Days */}
      <View style={styles.switchContainer}>
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
      </View>
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
  yAxisCustomLabels: {
    position: 'absolute',
    left: 0,
    top: 16,
    width: 60,
    justifyContent: 'space-between',
  },
  tooltip: {
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  tooltipText: {
    fontSize: 12,
    marginBottom: 4,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  switchButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginHorizontal: 4,
  },
  activeButton: {
    backgroundColor: 'rgba(0, 230, 118, 0.2)',
  },
  switchText: {
    fontSize: 14,
  },
});

export default MoodLineChart;
