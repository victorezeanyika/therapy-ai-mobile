import { Colors } from "./Colors";

const chartData = {
    labels: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      {
        data: [3, 4, 5, 3, 4, 5, 4],
        color: () => Colors.harmony.primary,
        strokeWidth: 2,
        label: 'Happy',
      },
      {
        data: [2, 3, 2, 4, 3, 2, 3],
        color: () => '#FF5252',
        strokeWidth: 2,
        label: 'Sad',
      },
    ],
    // legend: ['Happy', 'Sad'],
  };
  const moodOptions = [
    { name: "Sad", color: "#bdedff" },
    { name: "Fear", color: "#f1d5fe" },
    { name: "Angry", color: "#ffc6b8" },
    { name: "Surprise", color: "#fed190" },
    { name: "Happy", color: "#fff6bf" },
  ];
  
  
  
  const summaryText =
    'Over the past week, your mood has been generally positive, with a slight dip occurring around mid-week. This temporary decline may be linked to increased stress levels reported during that time. Read More';
  
  const previousEntries = [
    { mood: 'Sad', icon: 'sad-outline', color: '#bdedff' },
    { mood: 'Fear', icon: 'alert-circle-outline', color: '#f1d5fe' },
    { mood: 'Angry', icon: 'flame-outline', color: '#ffc6b8' },
    { mood: 'Surprise', icon: 'flash-outline', color: '#fed190' },
    { mood: 'Happy', icon: 'happy-outline', color: '#fff6bf' },
  ];

  export {
    chartData,
    moodOptions,
    summaryText,
    previousEntries,
  };