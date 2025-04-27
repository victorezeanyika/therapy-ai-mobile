import { LineChart } from "react-native-chart-kit";
import { Dimensions, StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

const MoodLineChart = ({ data }: { data: any }) => {
  const cardBg = useThemeColor({ light: '#FFFFFF', dark: '#232627' }, 'bgCard');
  const labelColor = useThemeColor({ dark: '#FFFFFF', light: '#232627' }, 'lable');

  return (
    <LineChart
      data={data}
      width={Dimensions.get('window').width - 32}
      height={208}
      chartConfig={{
        backgroundColor: cardBg,
        backgroundGradientFrom: cardBg,
        backgroundGradientTo: cardBg,
        color: (opacity = 1) => `rgba(0, 230, 118, ${opacity})`,
        labelColor: () => labelColor,
        propsForDots: { r: '4', strokeWidth: '2', stroke: '#fff' },
      }}
      bezier
      style={{ borderRadius: 16, marginVertical: 8 }}
    />
  );
};

export default MoodLineChart;

